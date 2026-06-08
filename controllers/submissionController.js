const submissionService = require('../services/submissionService');
const { emitNewSubmission } = require('../socket');

const createSubmission = async (req, res) => {
  try {
    const { testId, answers } = req.body;
    const result = await submissionService.createSubmission(
      req.user.userId,
      testId,
      answers
    );

    if (result.error) {
      return res.status(result.error.statusCode).json({
        success: false,
        message: result.error.message
      });
    }

    const { submission, test, student } = result;
    const studentName = student?.name || student?.email;

    emitNewSubmission(test.createdBy.toString(), {
      studentName,
      testTitle: test.title,
      score: submission.score
    });

    return res.status(201).json({
      success: true,
      message: 'Test submitted successfully',
      data: {
        submission,
        score: submission.score,
        testTitle: test.title,
        studentName
      }
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to submit test',
      error: err.message
    });
  }
};

module.exports = {
  createSubmission
};
