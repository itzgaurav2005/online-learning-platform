const express = require('express');
const { body, param } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();
const prisma = new PrismaClient();

// Add review to a course
router.post('/courses/:courseId/reviews',
  authenticate,
  authorize('STUDENT'),
  [
    param('courseId').isInt(),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim()
  ],
  validate,
  async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const userId = req.user.id;
      const { rating, comment } = req.body;

      // Check if course exists
      const course = await prisma.course.findUnique({
        where: { id: courseId }
      });

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      // Check if enrolled
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        }
      });

      if (!enrollment) {
        return res.status(403).json({ error: 'Must be enrolled to leave a review' });
      }

      // Check if already reviewed
      const existingReview = await prisma.review.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        }
      });

      if (existingReview) {
        return res.status(400).json({ error: 'You have already reviewed this course' });
      }

      // Create review
      const review = await prisma.review.create({
        data: {
          userId,
          courseId,
          rating,
          comment
        },
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      res.status(201).json({
        message: 'Review added successfully',
        review
      });
    } catch (error) {
      console.error('Add review error:', error);
      res.status(500).json({ error: 'Failed to add review' });
    }
  }
);

// Update review
router.put('/reviews/:reviewId',
  authenticate,
  authorize('STUDENT'),
  [
    param('reviewId').isInt(),
    body('rating').optional().isInt({ min: 1, max: 5 }),
    body('comment').optional().trim()
  ],
  validate,
  async (req, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      const { rating, comment } = req.body;

      // Check if review exists and belongs to user
      const existingReview = await prisma.review.findUnique({
        where: { id: reviewId }
      });

      if (!existingReview) {
        return res.status(404).json({ error: 'Review not found' });
      }

      if (existingReview.userId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to update this review' });
      }

      const review = await prisma.review.update({
        where: { id: reviewId },
        data: {
          ...(rating && { rating }),
          ...(comment !== undefined && { comment })
        },
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      res.json({
        message: 'Review updated successfully',
        review
      });
    } catch (error) {
      console.error('Update review error:', error);
      res.status(500).json({ error: 'Failed to update review' });
    }
  }
);

// Delete review
router.delete('/reviews/:reviewId',
  authenticate,
  param('reviewId').isInt(),
  validate,
  async (req, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);

      const existingReview = await prisma.review.findUnique({
        where: { id: reviewId }
      });

      if (!existingReview) {
        return res.status(404).json({ error: 'Review not found' });
      }

      // Allow user to delete their own review or admin to delete any
      if (existingReview.userId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Not authorized to delete this review' });
      }

      await prisma.review.delete({
        where: { id: reviewId }
      });

      res.json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Delete review error:', error);
      res.status(500).json({ error: 'Failed to delete review' });
    }
  }
);

// Get reviews for a course
router.get('/courses/:courseId/reviews',
  param('courseId').isInt(),
  validate,
  async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const { page = 1, limit = 10 } = req.query;
      const skip = (page - 1) * limit;

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where: { courseId },
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' }
        }),
        prisma.review.count({ where: { courseId } })
      ]);

      // Calculate average rating
      const allReviews = await prisma.review.findMany({
        where: { courseId },
        select: { rating: true }
      });

      const avgRating = allReviews.length > 0
        ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        : 0;

      // Calculate rating distribution
      const ratingDistribution = {
        5: allReviews.filter(r => r.rating === 5).length,
        4: allReviews.filter(r => r.rating === 4).length,
        3: allReviews.filter(r => r.rating === 3).length,
        2: allReviews.filter(r => r.rating === 2).length,
        1: allReviews.filter(r => r.rating === 1).length
      };

      res.json({
        reviews,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        },
        stats: {
          averageRating: Math.round(avgRating * 10) / 10,
          totalReviews: total,
          distribution: ratingDistribution
        }
      });
    } catch (error) {
      console.error('Get reviews error:', error);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  }
);

module.exports = router;
