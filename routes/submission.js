const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const submissionValidator = require('../validators/submissionValidator');
const validate = require('../middlewares/validate');
const requireRole = require('../middlewares/roleMiddleware');

router.post(
  '/',
  requireRole('student'),
  ...submissionValidator.createSubmissionValidation,
  validate,
  submissionController.createSubmission
);

module.exports = router;
