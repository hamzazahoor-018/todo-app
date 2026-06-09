const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const testValidator = require('../validators/testValidator');
const validate = require('../middlewares/validate');
const requireRole = require('../middlewares/roleMiddleware');

router.post(
  '/',
  requireRole('teacher'),
  ...testValidator.createTestValidation,
  validate,
  testController.createTest
);

router.get(
  '/mine',
  requireRole('teacher'),
  testController.getMyTests
);

router.get(
  '/',
  requireRole('student'),
  testController.getTests
);

router.get(
  '/:id',
  requireRole('student', 'teacher'),
  ...testValidator.getTestByIdValidation,
  validate,
  testController.getTestById
);

router.put(
  '/:id',
  requireRole('teacher'),
  ...testValidator.updateTestValidation,
  validate,
  testController.updateTest
);

router.delete(
  '/:id',
  requireRole('teacher'),
  ...testValidator.deleteTestValidation,
  validate,
  testController.deleteTest
);

module.exports = router;
