const { body } = require('express-validator');

const createSubmissionValidation = [
  body('testId')
    .isMongoId()
    .withMessage('Invalid test id'),

  body('answers')
    .isArray({ min: 1 })
    .withMessage('Answers must be a non-empty array'),

  body('answers.*')
    .isInt({ min: 0 })
    .withMessage('Each answer must be a valid option index')
];

module.exports = {
  createSubmissionValidation
};
