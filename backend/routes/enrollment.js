const express = require('express');
const { param } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();
const prisma = new PrismaClient();

// Enroll in a course
router.post('/courses/:courseId/enroll',
  authenticate,
  authorize('STUDENT'),
  param('courseId').isInt(),
  validate,
  async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const userId = req.user.id;

      // Check if course exists and is published
      const course = await prisma.course.findUnique({
        where: { id: courseId }
      });

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      if (!course.isPublished || !course.isApproved) {
        return res.status(400).json({ error: 'Course is not available for enrollment' });
      }

      if (parseFloat(course.price) > 0) {
        return res.status(400).json({ 
          error: 'This is a paid course. Please complete payment first.',
          requiresPayment: true,
          price: course.price
        });
      }

      // Check if already enrolled
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        }
      });

      if (existingEnrollment) {
        return res.status(400).json({ error: 'Already enrolled in this course' });
      }

      // Create enrollment
      const enrollment = await prisma.enrollment.create({
        data: {
          userId,
          courseId
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              description: true
            }
          }
        }
      });

      res.status(201).json({
        message: 'Enrolled successfully',
        enrollment
      });
    } catch (error) {
      console.error('Enrollment error:', error);
      res.status(500).json({ error: 'Failed to enroll in course' });
    }
  }
);

// Get user's enrollments
router.get('/users/me/enrollments',
  authenticate,
  authorize('STUDENT'),
  async (req, res) => {
    try {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: req.user.id },
        include: {
          course: {
            include: {
              instructor: {
                select: { id: true, name: true }
              },
              modules: {
                include: {
                  lessons: true
                }
              },
              _count: {
                select: { reviews: true }
              },
              reviews: {
                select: { rating: true }
              }
            }
          }
        },
        orderBy: { enrolledAt: 'desc' }
      });

      // Calculate progress for each enrollment
      const enrollmentsWithProgress = await Promise.all(
        enrollments.map(async (enrollment) => {
          const totalLessons = enrollment.course.modules.reduce(
            (sum, module) => sum + module.lessons.length,
            0
          );

          const completedLessons = await prisma.progress.count({
            where: {
              userId: req.user.id,
              lesson: {
                module: {
                  courseId: enrollment.courseId
                }
              },
              completed: true
            }
          });

          const progressPercentage = totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0;

          // Calculate average rating
          const avgRating = enrollment.course.reviews.length > 0
            ? enrollment.course.reviews.reduce((sum, r) => sum + r.rating, 0) / enrollment.course.reviews.length
            : 0;

          return {
            ...enrollment,
            progress: {
              completedLessons,
              totalLessons,
              percentage: progressPercentage
            },
            course: {
              ...enrollment.course,
              averageRating: Math.round(avgRating * 10) / 10
            }
          };
        })
      );

      res.json({ enrollments: enrollmentsWithProgress });
    } catch (error) {
      console.error('Get enrollments error:', error);
      res.status(500).json({ error: 'Failed to fetch enrollments' });
    }
  }
);

// Check if user is enrolled in a course
router.get('/courses/:courseId/enrollment-status',
  authenticate,
  param('courseId').isInt(),
  validate,
  async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);

      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: req.user.id,
            courseId
          }
        }
      });

      res.json({
        isEnrolled: !!enrollment,
        enrollment
      });
    } catch (error) {
      console.error('Check enrollment error:', error);
      res.status(500).json({ error: 'Failed to check enrollment status' });
    }
  }
);

// Get enrolled students (Instructor only)
router.get('/courses/:courseId/students',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  param('courseId').isInt(),
  validate,
  async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);

      // Verify ownership
      const course = await prisma.course.findUnique({
        where: { id: courseId }
      });

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      if (req.user.role === 'INSTRUCTOR' && course.instructorId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const enrollments = await prisma.enrollment.findMany({
        where: { courseId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { enrolledAt: 'desc' }
      });

      res.json({
        students: enrollments.map(e => ({
          ...e.user,
          enrolledAt: e.enrolledAt
        })),
        total: enrollments.length
      });
    } catch (error) {
      console.error('Get students error:', error);
      res.status(500).json({ error: 'Failed to fetch students' });
    }
  }
);

module.exports = router;
