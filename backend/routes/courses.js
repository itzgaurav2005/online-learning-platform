const express = require('express');
const { body, param } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();
const prisma = new PrismaClient();

// Get all published courses (public)
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      isPublished: true,
      isApproved: true
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        include: {
          instructor: {
            select: { id: true, name: true }
          },
          _count: {
            select: { enrollments: true, reviews: true }
          },
          reviews: {
            select: { rating: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.course.count({ where })
    ]);

    // Calculate average rating
    const coursesWithRating = courses.map(course => {
      const avgRating = course.reviews.length > 0
        ? course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length
        : 0;
      
      const { reviews, ...courseData } = course;
      return {
        ...courseData,
        averageRating: Math.round(avgRating * 10) / 10,
        enrollmentCount: course._count.enrollments,
        reviewCount: course._count.reviews
      };
    });

    res.json({
      courses: coursesWithRating,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get single course details
router.get('/:id', param('id').isInt(), validate, async (req, res) => {
  try {
    const courseId = parseInt(req.params.id);

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          select: { id: true, name: true, email: true }
        },
        modules: {
          include: {
            lessons: {
              orderBy: { orderIndex: 'asc' }
            }
          },
          orderBy: { orderIndex: 'asc' }
        },
        _count: {
          select: { enrollments: true, reviews: true }
        },
        reviews: {
          include: {
            user: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Calculate average rating
    const avgRating = course.reviews.length > 0
      ? course.reviews.reduce((sum, r) => sum + r.rating, 0) / course.reviews.length
      : 0;

    res.json({
      ...course,
      averageRating: Math.round(avgRating * 10) / 10
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// Create course (Instructor only)
router.post('/',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  ],
  validate,
  async (req, res) => {
    try {
      const { title, description, price } = req.body;

      const course = await prisma.course.create({
        data: {
          title,
          description,
          price: price || 0,
          instructorId: req.user.id
        },
        include: {
          instructor: {
            select: { id: true, name: true }
          }
        }
      });

      res.status(201).json({
        message: 'Course created successfully',
        course
      });
    } catch (error) {
      console.error('Create course error:', error);
      res.status(500).json({ error: 'Failed to create course' });
    }
  }
);

// Update course
router.put('/:id',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  [
    param('id').isInt(),
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('isPublished').optional().isBoolean(),
    body('price').optional().isFloat({ min: 0 }),
  ],
  validate,
  async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const { title, description, isPublished, price } = req.body;

      // Check ownership
      const existingCourse = await prisma.course.findUnique({
        where: { id: courseId }
      });

      if (!existingCourse) {
        return res.status(404).json({ error: 'Course not found' });
      }

      if (req.user.role === 'INSTRUCTOR' && existingCourse.instructorId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to update this course' });
      }

      const course = await prisma.course.update({
        where: { id: courseId },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(typeof isPublished === 'boolean' && { isPublished }),
          ...(price !== undefined && { price }),
        },
        include: {
          instructor: {
            select: { id: true, name: true }
          }
        }
      });

      res.json({
        message: 'Course updated successfully',
        course
      });
    } catch (error) {
      console.error('Update course error:', error);
      res.status(500).json({ error: 'Failed to update course' });
    }
  }
);

// Delete course
router.delete('/:id',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  param('id').isInt(),
  validate,
  async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);

      const existingCourse = await prisma.course.findUnique({
        where: { id: courseId }
      });

      if (!existingCourse) {
        return res.status(404).json({ error: 'Course not found' });
      }

      if (req.user.role === 'INSTRUCTOR' && existingCourse.instructorId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to delete this course' });
      }

      await prisma.course.delete({
        where: { id: courseId }
      });

      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Delete course error:', error);
      res.status(500).json({ error: 'Failed to delete course' });
    }
  }
);

// Get instructor's courses
router.get('/instructor/my-courses',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  async (req, res) => {
    try {
      const courses = await prisma.course.findMany({
        where: { instructorId: req.user.id },
        include: {
          _count: {
            select: { enrollments: true, modules: true, reviews: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({ courses });
    } catch (error) {
      console.error('Get instructor courses error:', error);
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  }
);

module.exports = router;
