const submissionService = require('../services/submissionService');
const { emitNewSubmission } = require('../socket');

const createSubmission = async (req, res) => {
  const { testId, answers } = req.body;
  const { submission, test, student } = await submissionService.createSubmission(
    req.user.userId,
    testId,
    answers
  );

  const studentName = student?.name || student?.email;

  emitNewSubmission(test.createdBy.toString(), {
    studentName,
    testTitle: test.title,
    score: submission.score
  });

  res.status(201).json({
    success: true,
    message: 'Test submitted successfully',
    data: {
      submission,
      score: submission.score,
      testTitle: test.title,
      studentName
    }
  });
};

const getMySubmissions = async (req, res) => {
  const submissions = await submissionService.getSubmissionsByStudent(req.user.userId);

  res.status(200).json({
    success: true,
    data: submissions
  });
};

const getTeacherSubmissions = async (req, res) => {
  const submissions = await submissionService.getSubmissionsByTeacher(req.user.userId);

  res.status(200).json({
    success: true,
    data: submissions
  });
};

const getTestSubmissions = async (req, res) => {
  const { test, submissions } = await submissionService.getSubmissionsByTest(
    req.user.userId,
    req.params.testId
  );

  res.status(200).json({
    success: true,
    data: { test, submissions }
  });
};

module.exports = {
  createSubmission,
  getMySubmissions,
  getTeacherSubmissions,
  getTestSubmissions
};
