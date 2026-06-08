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
  '/',
  requireRole('student'),
  testController.getTests
);

module.exports = router;
