const Test = require('../models/Test');
const Submission = require('../models/Submission');
const AppError = require('../utils/AppError');

const validateQuestions = (questions) => {
  for (const question of questions) {
    if (question.correctOptionIndex >= question.options.length) {
      throw new AppError(400, 'Correct option index is out of range for one or more questions');
    }
  }
};

const createTest = (teacherId, { title, questions }) => {
  validateQuestions(questions);

  return Test.create({
    title,
    questions,
    createdBy: teacherId
  });
};

const getAllTests = () => {
  return Test.find()
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
};

const getTestsByTeacher = (teacherId) => {
  return Test.find({ createdBy: teacherId }).sort({ createdAt: -1 });
};

const getTestById = (testId) => {
  return Test.findById(testId).populate('createdBy', 'name email');
};

const getOwnedTest = async (testId, teacherId) => {
  const test = await Test.findOne({ _id: testId, createdBy: teacherId });
  if (!test) {
    throw new AppError(404, 'Test not found');
  }
  return test;
};

const hasSubmissions = (testId) => {
  return Submission.exists({ testId });
};

const updateTest = async (teacherId, testId, { title, questions }) => {
  const test = await getOwnedTest(testId, teacherId);

  if (await hasSubmissions(testId)) {
    throw new AppError(409, 'Cannot edit a test that already has submissions');
  }

  validateQuestions(questions);

  test.title = title;
  test.questions = questions;
  await test.save();

  return test;
};

const deleteTest = async (teacherId, testId) => {
  await getOwnedTest(testId, teacherId);

  if (await hasSubmissions(testId)) {
    throw new AppError(409, 'Cannot delete a test that already has submissions');
  }

  await Test.findByIdAndDelete(testId);
};

const stripCorrectAnswers = (test) => {
  const testObject = test.toObject();

  return {
    ...testObject,
    questions: testObject.questions.map(({ correctOptionIndex, ...question }) => question)
  };
};

module.exports = {
  createTest,
  getAllTests,
  getTestsByTeacher,
  getTestById,
  getOwnedTest,
  updateTest,
  deleteTest,
  stripCorrectAnswers
};
