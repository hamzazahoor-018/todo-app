const Submission = require('../models/Submission');
const Test = require('../models/Test');
const User = require('../models/User');

const calculateScore = (test, answers) => {
  let score = 0;

  test.questions.forEach((question, index) => {
    if (question.type === 'mcq' && answers[index] === question.correctOptionIndex) {
      score += question.points;
    }
  });

  return score;
};

const createSubmission = async (studentId, testId, answers) => {
  const test = await Test.findById(testId);
  if (!test) {
    return { error: { statusCode: 404, message: 'Test not found' } };
  }

  if (answers.length !== test.questions.length) {
    return {
      error: {
        statusCode: 400,
        message: 'Number of answers must match the number of questions'
      }
    };
  }

  const existingSubmission = await Submission.findOne({ testId, studentId });
  if (existingSubmission) {
    return {
      error: {
        statusCode: 409,
        message: 'You have already submitted this test'
      }
    };
  }

  const score = calculateScore(test, answers);

  const submission = await Submission.create({
    testId,
    studentId,
    answers,
    score
  });

  const student = await User.findById(studentId).select('name email');

  return {
    submission,
    test,
    student
  };
};

module.exports = {
  createSubmission,
  calculateScore
};
