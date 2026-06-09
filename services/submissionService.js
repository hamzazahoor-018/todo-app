const Submission = require('../models/Submission');
const Test = require('../models/Test');
const User = require('../models/User');
const AppError = require('../utils/AppError');

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
    throw new AppError(404, 'Test not found');
  }

  if (answers.length !== test.questions.length) {
    throw new AppError(400, 'Number of answers must match the number of questions');
  }

  const existingSubmission = await Submission.findOne({ testId, studentId });
  if (existingSubmission) {
    throw new AppError(409, 'You have already submitted this test');
  }

  const score = calculateScore(test, answers);

  const submission = await Submission.create({
    testId,
    studentId,
    answers,
    score
  });

  const student = await User.findById(studentId).select('name email');

  return { submission, test, student };
};

const getSubmissionsByStudent = (studentId) => {
  return Submission.find({ studentId })
    .populate('testId', 'title createdBy')
    .sort({ submittedAt: -1 });
};

const getSubmissionsByTeacher = async (teacherId) => {
  const teacherTests = await Test.find({ createdBy: teacherId }).select('_id');
  const testIds = teacherTests.map((test) => test._id);

  return Submission.find({ testId: { $in: testIds } })
    .populate('studentId', 'name email')
    .populate('testId', 'title')
    .sort({ submittedAt: -1 });
};

const getSubmissionsByTest = async (teacherId, testId) => {
  const test = await Test.findOne({ _id: testId, createdBy: teacherId });
  if (!test) {
    throw new AppError(404, 'Test not found');
  }

  const submissions = await Submission.find({ testId })
    .populate('studentId', 'name email')
    .sort({ submittedAt: -1 });

  return { test, submissions };
};

module.exports = {
  createSubmission,
  calculateScore,
  getSubmissionsByStudent,
  getSubmissionsByTeacher,
  getSubmissionsByTest
};
