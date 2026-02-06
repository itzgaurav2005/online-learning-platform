const express = require('express');
const { param, body } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();
const prisma = new PrismaClient();

// Get all users (Admin only)
router.get('/users',
  authenticate,
  authorize('ADMIN'),
  async (req, res) => {
    try {
      const { page = 1, limit = 20, role } = req.query;
      const skip = (page - 1) * limit;

      const where = {};
      if (role) {
        where.role = role;
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            _count: {
              select: {
                coursesCreated: true,
                enrollments: true,
                reviews: true
              }
            }
          },
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count({ where })
      ]);

      res.json({
        users,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }
);

// Delete user (Admin only)
router.delete('/users/:userId',
  authenticate,
  authorize('ADMIN'),
  param('userId').isInt(),
  validate,
  async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Prevent admin from deleting themselves
      if (userId === req.user.id) {
        return res.status(400).json({ error: 'Cannot delete your own account' });
      }

      await prisma.user.delete({
        where: { id: userId }
      });

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  }
);

// Get all courses (including unpublished)
router.get('/courses',
  authenticate,
  authorize('ADMIN'),
  async (req, res) => {
    try {
      const { page = 1, limit = 20, isApproved, isPublished } = req.query;
      const skip = (page - 1) * limit;

      const where = {};
      if (isApproved !== undefined) {
        where.isApproved = isApproved === 'true';
      }
      if (isPublished !== undefined) {
        where.isPublished = isPublished === 'true';
      }

      const [courses, total] = await Promise.all([
        prisma.course.findMany({
          where,
          include: {
            instructor: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            _count: {
              select: {
                enrollments: true,
                modules: true,
                reviews: true
              }
            }
          },
          skip: parseInt(skip),
          take: parseInt(limit),
          orderBy: { createdAt: 'desc' }
        }),
        prisma.course.count({ where })
      ]);

      res.json({
        courses,
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
  }
);

// Approve/reject course
router.put('/courses/:courseId/approve',
  authenticate,
  authorize('ADMIN'),
  [
    param('courseId').isInt(),
    body('isApproved').isBoolean().withMessage('isApproved must be a boolean')
  ],
  validate,
  async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const { isApproved } = req.body;

      const course = await prisma.course.findUnique({
        where: { id: courseId }
      });

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      const updatedCourse = await prisma.course.update({
        where: { id: courseId },
        data: { isApproved },
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      res.json({
        message: `Course ${isApproved ? 'approved' : 'rejected'} successfully`,
        course: updatedCourse
      });
    } catch (error) {
      console.error('Approve course error:', error);
      res.status(500).json({ error: 'Failed to update course approval' });
    }
  }
);

// Delete course (Admin can delete any course)
router.delete('/courses/:courseId',
  authenticate,
  authorize('ADMIN'),
  param('courseId').isInt(),
  validate,
  async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);

      const course = await prisma.course.findUnique({
        where: { id: courseId }
      });

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
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

// Platform analytics
router.get('/analytics',
  authenticate,
  authorize('ADMIN'),
  async (req, res) => {
    try {
      const [
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalReviews,
        usersByRole,
        recentEnrollments
      ] = await Promise.all([
        prisma.user.count(),
        prisma.course.count(),
        prisma.enrollment.count(),
        prisma.review.count(),
        prisma.user.groupBy({
          by: ['role'],
          _count: true
        }),
        prisma.enrollment.findMany({
          take: 10,
          include: {
            user: {
              select: { name: true, email: true }
            },
            course: {
              select: { title: true }
            }
          },
          orderBy: { enrolledAt: 'desc' }
        })
      ]);

      // Top courses by enrollment
      const topCourses = await prisma.course.findMany({
        take: 10,
        include: {
          instructor: {
            select: { name: true }
          },
          _count: {
            select: { enrollments: true }
          }
        },
        orderBy: {
          enrollments: {
            _count: 'desc'
          }
        }
      });

      res.json({
        overview: {
          totalUsers,
          totalCourses,
          totalEnrollments,
          totalReviews
        },
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item.role] = item._count;
          return acc;
        }, {}),
        topCourses: topCourses.map(c => ({
          id: c.id,
          title: c.title,
          instructor: c.instructor.name,
          enrollments: c._count.enrollments
        })),
        recentEnrollments: recentEnrollments.map(e => ({
          user: e.user.name,
          course: e.course.title,
          enrolledAt: e.enrolledAt
        }))
      });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  }
);

module.exports = router;
