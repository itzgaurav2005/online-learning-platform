const express = require('express');
const { body, param } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { authenticate, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();
const prisma = new PrismaClient();

// Create module for a course
router.post('/courses/:courseId/modules',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  [
    param('courseId').isInt(),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('orderIndex').isInt({ min: 0 }).withMessage('Order index must be a positive integer')
  ],
  validate,
  async (req, res) => {
    try {
      const courseId = parseInt(req.params.courseId);
      const { title, orderIndex } = req.body;

      // Verify course ownership
      const course = await prisma.course.findUnique({
        where: { id: courseId }
      });

      if (!course) {
        return res.status(404).json({ error: 'Course not found' });
      }

      if (req.user.role === 'INSTRUCTOR' && course.instructorId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const module = await prisma.module.create({
        data: {
          courseId,
          title,
          orderIndex
        }
      });

      res.status(201).json({
        message: 'Module created successfully',
        module
      });
    } catch (error) {
      console.error('Create module error:', error);
      res.status(500).json({ error: 'Failed to create module' });
    }
  }
);

// Update module
router.put('/modules/:id',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  [
    param('id').isInt(),
    body('title').optional().trim().notEmpty(),
    body('orderIndex').optional().isInt({ min: 0 })
  ],
  validate,
  async (req, res) => {
    try {
      const moduleId = parseInt(req.params.id);
      const { title, orderIndex } = req.body;

      // Verify ownership
      const moduleData = await prisma.module.findUnique({
        where: { id: moduleId },
        include: { course: true }
      });

      if (!moduleData) {
        return res.status(404).json({ error: 'Module not found' });
      }

      if (req.user.role === 'INSTRUCTOR' && moduleData.course.instructorId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const module = await prisma.module.update({
        where: { id: moduleId },
        data: {
          ...(title && { title }),
          ...(orderIndex !== undefined && { orderIndex })
        }
      });

      res.json({
        message: 'Module updated successfully',
        module
      });
    } catch (error) {
      console.error('Update module error:', error);
      res.status(500).json({ error: 'Failed to update module' });
    }
  }
);

// Delete module
router.delete('/modules/:id',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  param('id').isInt(),
  validate,
  async (req, res) => {
    try {
      const moduleId = parseInt(req.params.id);

      const moduleData = await prisma.module.findUnique({
        where: { id: moduleId },
        include: { course: true }
      });

      if (!moduleData) {
        return res.status(404).json({ error: 'Module not found' });
      }

      if (req.user.role === 'INSTRUCTOR' && moduleData.course.instructorId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      await prisma.module.delete({
        where: { id: moduleId }
      });

      res.json({ message: 'Module deleted successfully' });
    } catch (error) {
      console.error('Delete module error:', error);
      res.status(500).json({ error: 'Failed to delete module' });
    }
  }
);

// Create lesson for a module
router.post('/modules/:moduleId/lessons',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  [
    param('moduleId').isInt(),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('contentType').isIn(['VIDEO', 'TEXT']).withMessage('Content type must be VIDEO or TEXT'),
    body('videoUrl').optional().isURL(),
    body('textContent').optional().trim(),
    body('duration').optional().isInt({ min: 0 }),
    body('orderIndex').isInt({ min: 0 })
  ],
  validate,
  async (req, res) => {
    try {
      const moduleId = parseInt(req.params.moduleId);
      const { title, contentType, videoUrl, textContent, duration, orderIndex } = req.body;

      // Verify ownership
      const moduleData = await prisma.module.findUnique({
        where: { id: moduleId },
        include: { course: true }
      });

      if (!moduleData) {
        return res.status(404).json({ error: 'Module not found' });
      }

      if (req.user.role === 'INSTRUCTOR' && moduleData.course.instructorId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const lesson = await prisma.lesson.create({
        data: {
          moduleId,
          title,
          contentType,
          videoUrl,
          textContent,
          duration,
          orderIndex
        }
      });

      res.status(201).json({
        message: 'Lesson created successfully',
        lesson
      });
    } catch (error) {
      console.error('Create lesson error:', error);
      res.status(500).json({ error: 'Failed to create lesson' });
    }
  }
);

// Update lesson
router.put('/lessons/:id',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  [
    param('id').isInt(),
    body('title').optional().trim().notEmpty(),
    body('contentType').optional().isIn(['VIDEO', 'TEXT']),
    body('videoUrl').optional().isURL(),
    body('textContent').optional().trim(),
    body('duration').optional().isInt({ min: 0 }),
    body('orderIndex').optional().isInt({ min: 0 })
  ],
  validate,
  async (req, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const { title, contentType, videoUrl, textContent, duration, orderIndex } = req.body;

      // Verify ownership
      const lessonData = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          module: {
            include: { course: true }
          }
        }
      });

      if (!lessonData) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      if (req.user.role === 'INSTRUCTOR' && lessonData.module.course.instructorId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const lesson = await prisma.lesson.update({
        where: { id: lessonId },
        data: {
          ...(title && { title }),
          ...(contentType && { contentType }),
          ...(videoUrl !== undefined && { videoUrl }),
          ...(textContent !== undefined && { textContent }),
          ...(duration !== undefined && { duration }),
          ...(orderIndex !== undefined && { orderIndex })
        }
      });

      res.json({
        message: 'Lesson updated successfully',
        lesson
      });
    } catch (error) {
      console.error('Update lesson error:', error);
      res.status(500).json({ error: 'Failed to update lesson' });
    }
  }
);

// Delete lesson
router.delete('/lessons/:id',
  authenticate,
  authorize('INSTRUCTOR', 'ADMIN'),
  param('id').isInt(),
  validate,
  async (req, res) => {
    try {
      const lessonId = parseInt(req.params.id);

      const lessonData = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          module: {
            include: { course: true }
          }
        }
      });

      if (!lessonData) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      if (req.user.role === 'INSTRUCTOR' && lessonData.module.course.instructorId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }

      await prisma.lesson.delete({
        where: { id: lessonId }
      });

      res.json({ message: 'Lesson deleted successfully' });
    } catch (error) {
      console.error('Delete lesson error:', error);
      res.status(500).json({ error: 'Failed to delete lesson' });
    }
  }
);

module.exports = router;
