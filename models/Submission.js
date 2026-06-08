const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: {
    type: [Number],
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['submitted'],
    default: 'submitted'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

submissionSchema.index({ testId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
