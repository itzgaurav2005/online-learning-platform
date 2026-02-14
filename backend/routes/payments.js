const express = require('express');
const Stripe = require('stripe');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe checkout session
router.post('/create-checkout-session', authenticate, authorize('STUDENT'), async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // Get course details
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) },
      include: { instructor: { select: { name: true } } }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (!course.isPublished || !course.isApproved) {
      return res.status(400).json({ error: 'Course is not available' });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId: parseInt(courseId) }
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Check if course is free
    if (parseFloat(course.price) === 0) {
      return res.status(400).json({ error: 'This is a free course, enroll directly' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: course.currency || 'usd',
            product_data: {
              name: course.title,
              description: course.description.substring(0, 200),
            },
            unit_amount: Math.round(parseFloat(course.price) * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel?course_id=${courseId}`,
      metadata: {
        userId: userId.toString(),
        courseId: courseId.toString(),
      },
    });

    // Create pending payment record
    await prisma.payment.create({
      data: {
        userId,
        courseId: parseInt(courseId),
        amount: course.price,
        currency: course.currency || 'usd',
        status: 'pending',
        stripeSessionId: session.id,
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Create checkout session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Verify payment (called from success page)
router.get('/verify-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.json({ success: false, message: 'Payment not completed' });
    }

    const userId = parseInt(session.metadata.userId);
    const courseId = parseInt(session.metadata.courseId);

    // Update payment status
    await prisma.payment.update({
      where: { stripeSessionId: sessionId },
      data: {
        status: 'completed',
        stripePaymentId: session.payment_intent,
      }
    });

    // Create enrollment if not exists
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId }
      }
    });

    if (!existingEnrollment) {
      await prisma.enrollment.create({
        data: { userId, courseId }
      });
    }

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Verification failed' });
  }
});


// Stripe webhook handler
// router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
//   const sig = req.headers['stripe-signature'];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.error('Webhook signature verification failed:', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle the checkout.session.completed event
//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object;

//     try {
//       const userId = parseInt(session.metadata.userId);
//       const courseId = parseInt(session.metadata.courseId);

//       // Update payment status
//       await prisma.payment.update({
//         where: { stripeSessionId: session.id },
//         data: {
//           status: 'completed',
//           stripePaymentId: session.payment_intent,
//         }
//       });

//       // Create enrollment (if not exists)
//       const existingEnrollment = await prisma.enrollment.findUnique({
//         where: {
//           userId_courseId: { userId, courseId }
//         }
//       });

//       if (!existingEnrollment) {
//         await prisma.enrollment.create({
//           data: { userId, courseId }
//         });
//       }

//       console.log('Payment completed and enrollment created:', { userId, courseId });
//     } catch (error) {
//       console.error('Error processing webhook:', error);
//       return res.status(500).json({ error: 'Webhook processing failed' });
//     }
//   }

//   res.json({ received: true });
// });

// Get user's payment history
router.get('/my-payments', authenticate, authorize('STUDENT'), async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ payments });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Admin: Get all payments
router.get('/admin/all-payments', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        include: {
          user: { select: { name: true, email: true } },
          course: { select: { title: true } }
        },
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.payment.count()
    ]);

    res.json({
      payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all payments error:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

module.exports = router;
