const express = require('express');
const { param } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();
const prisma = new PrismaClient();

// Mark lesson as complete
router.post('/lessons/:lessonId/complete',
  authenticate,
  authorize('STUDENT'),
  param('lessonId').isInt(),
  validate,
  async (req, res) => {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const userId = req.user.id;

      // Check if lesson exists
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          module: {
            include: {
              course: true
            }
          }
        }
      });

      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      // Check if user is enrolled
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId: lesson.module.courseId
          }
        }
      });

      if (!enrollment) {
        return res.status(403).json({ error: 'Not enrolled in this course' });
      }

      // Create or update progress
      const progress = await prisma.progress.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId
          }
        },
        update: {
          completed: true,
          completedAt: new Date()
        },
        create: {
          userId,
          lessonId,
          completed: true,
          completedAt: new Date()
        }
      });

      res.json({
        message: 'Lesson marked as complete',
        progress
      });
    } catch (error) {
      console.error('Complete lesson error:', error);
      res.status(500).json({ error: 'Failed to mark lesson as complete' });
    }
  }
);

// Mark lesson as incomplete
router.post('/lessons/:lessonId/incomplete',
  authenticate,
  authorize('STUDENT'),
  param('lessonId').isInt(),
  validate,
  async (req, res) => {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const userId = req.user.id;

      const progress = await prisma.progress.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId
          }
        },
        update: {
          completed: false,
          completedAt: null
        },
        create: {
          userId,
          lessonId,
          completed: false
        }
      });

      res.json({
        message: 'Lesson marked as incomplete',
        progress
      });
    } catch (error) {
      console.error('Incomplete lesson error:', error);
      res.status(500).json({ error: 'Failed to mark lesson as incomplete' });
    }
  }
);

// Get course progress
router.get('/courses/:courseId/progress',
  authenticate,
  authorize('STUDENT'),
  param('courseId').isInt(),
  validate,
  async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const userId = req.user.id;

      // Check enrollment
      const enrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId,
            courseId
          }
        }
      });

      if (!enrollment) {
        return res.status(403).json({ error: 'Not enrolled in this course' });
      }

      // Get all lessons in the course
      const modules = await prisma.module.findMany({
        where: { courseId },
        include: {
          lessons: {
            include: {
              progress: {
                where: { userId }
              }
            },
            orderBy: { orderIndex: 'asc' }
          }
        },
        orderBy: { orderIndex: 'asc' }
      });

      // Calculate progress
      let totalLessons = 0;
      let completedLessons = 0;

      const modulesWithProgress = modules.map(module => {
        const lessonsWithProgress = module.lessons.map(lesson => {
          totalLessons++;
          const isCompleted = lesson.progress.length > 0 && lesson.progress[0].completed;
          if (isCompleted) completedLessons++;

          return {
            id: lesson.id,
            title: lesson.title,
            contentType: lesson.contentType,
            duration: lesson.duration,
            orderIndex: lesson.orderIndex,
            completed: isCompleted,
            completedAt: lesson.progress[0]?.completedAt || null
          };
        });

        return {
          id: module.id,
          title: module.title,
          orderIndex: module.orderIndex,
          lessons: lessonsWithProgress
        };
      });

      const progressPercentage = totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

      res.json({
        courseId,
        modules: modulesWithProgress,
        summary: {
          totalLessons,
          completedLessons,
          percentage: progressPercentage
        }
      });
    } catch (error) {
      console.error('Get progress error:', error);
      res.status(500).json({ error: 'Failed to fetch progress' });
    }
  }
);

module.exports = router;
