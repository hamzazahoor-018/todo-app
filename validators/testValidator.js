const { body } = require('express-validator');

const createTestValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Test title is required')
    .isLength({ max: 200 })
    .withMessage('Test title cannot exceed 200 characters'),

  body('questions')
    .isArray({ min: 1 })
    .withMessage('At least one question is required'),

  body('questions.*.questionText')
    .trim()
    .notEmpty()
    .withMessage('Question text is required'),

  body('questions.*.points')
    .isInt({ min: 0 })
    .withMessage('Points must be a non-negative number'),

  body('questions.*.options')
    .isArray({ min: 2 })
    .withMessage('Each question must have at least 2 options'),

  body('questions.*.options.*')
    .trim()
    .notEmpty()
    .withMessage('Option text cannot be empty'),

  body('questions.*.correctOptionIndex')
    .isInt({ min: 0 })
    .withMessage('Correct option index must be a valid number'),

  body('questions.*.type')
    .optional()
    .isIn(['mcq'])
    .withMessage('Question type must be mcq')
];

module.exports = {
  createTestValidation
};
