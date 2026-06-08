const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authValidator = require('../validators/authValidator');
const validate = require('../middlewares/validate');
const authMiddleware = require('../middlewares/authMiddleware');

// Public Routes
router.post(
  '/signup',
  ...authValidator.signupValidation,
  validate,
  authController.signup
);

router.post(
  '/login',
  ...authValidator.loginValidation,
  validate,
  authController.login
);

router.post(
  '/refresh-token',
  authController.refreshAccessToken
);

// Protected Routes
router.post(
  '/logout',
  authMiddleware,
  authController.logout
);

module.exports = router;
