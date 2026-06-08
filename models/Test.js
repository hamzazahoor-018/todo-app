const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['mcq'], //will add more types later
      default: 'mcq'
    },
    questionText: {
      type: String,
      required: true,
      trim: true
    },
    points: {
      type: Number,
      required: true,
      min: 0
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: (options) => Array.isArray(options) && options.length >= 2,
        message: 'Each question must have at least 2 options'
      }
    },
    correctOptionIndex: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { _id: false }
);

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: {
    type: [questionSchema],
    required: true,
    validate: {
      validator: (questions) => Array.isArray(questions) && questions.length > 0,
      message: 'A test must have at least one question'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Test', testSchema);
