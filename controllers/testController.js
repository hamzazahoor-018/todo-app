const testService = require('../services/testService');
const AppError = require('../utils/AppError');

const createTest = async (req, res) => {
  const test = await testService.createTest(req.user.userId, req.body);

  res.status(201).json({
    success: true,
    message: 'Test created successfully',
    data: test
  });
};

const getTests = async (req, res) => {
  const tests = await testService.getAllTests();
  const safeTests = tests.map((test) => testService.stripCorrectAnswers(test));

  res.status(200).json({
    success: true,
    data: safeTests
  });
};

const getMyTests = async (req, res) => {
  const tests = await testService.getTestsByTeacher(req.user.userId);

  res.status(200).json({
    success: true,
    data: tests
  });
};

const getTestById = async (req, res) => {
  const test = await testService.getTestById(req.params.id);

  if (!test) {
    throw new AppError(404, 'Test not found');
  }

  if (req.user.role === 'teacher') {
    if (test.createdBy._id.toString() !== req.user.userId) {
      throw new AppError(403, 'You can only view your own tests with answers');
    }

    return res.status(200).json({
      success: true,
      data: test
    });
  }

  res.status(200).json({
    success: true,
    data: testService.stripCorrectAnswers(test)
  });
};

const updateTest = async (req, res) => {
  const test = await testService.updateTest(req.user.userId, req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Test updated successfully',
    data: test
  });
};

const deleteTest = async (req, res) => {
  await testService.deleteTest(req.user.userId, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Test deleted successfully'
  });
};

module.exports = {
  createTest,
  getTests,
  getMyTests,
  getTestById,
  updateTest,
  deleteTest
};
