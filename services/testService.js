const Test = require('../models/Test');

const createTest = (teacherId, { title, questions }) => {
  for (const question of questions) {
    if (question.correctOptionIndex >= question.options.length) {
      const error = new Error('Correct option index is out of range for one or more questions');
      error.statusCode = 400;
      throw error;
    }
  }

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

const getTestById = (testId) => {
  return Test.findById(testId);
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
  getTestById,
  stripCorrectAnswers
};
