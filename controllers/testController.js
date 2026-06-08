const testService = require('../services/testService');

const createTest = async (req, res) => {
  try {
    const test = await testService.createTest(req.user.userId, req.body);

    return res.status(201).json({
      success: true,
      message: 'Test created successfully',
      data: test
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.statusCode ? err.message : 'Failed to create test',
      error: err.statusCode ? undefined : err.message
    });
  }
};

const getTests = async (req, res) => {
  try {
    const tests = await testService.getAllTests();
    const safeTests = tests.map((test) => testService.stripCorrectAnswers(test));

    return res.status(200).json({
      success: true,
      data: safeTests
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch tests',
      error: err.message
    });
  }
};

module.exports = {
  createTest,
  getTests
};
