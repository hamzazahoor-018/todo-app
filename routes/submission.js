const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const submissionValidator = require('../validators/submissionValidator');
const testValidator = require('../validators/testValidator');
const validate = require('../middlewares/validate');
const requireRole = require('../middlewares/roleMiddleware');

router.post(
  '/',
  requireRole('student'),
  ...submissionValidator.createSubmissionValidation,
  validate,
  submissionController.createSubmission
);

router.get(
  '/mine',
  requireRole('student'),
  submissionController.getMySubmissions
);

router.get(
  '/',
  requireRole('teacher'),
  submissionController.getTeacherSubmissions
);

router.get(
  '/test/:testId',
  requireRole('teacher'),
  ...testValidator.testIdParamValidation,
  validate,
  submissionController.getTestSubmissions
);

module.exports = router;
