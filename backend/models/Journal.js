const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    ambience: {
      type: String,
      required: [true, 'Ambience is required'],
      enum: ['forest', 'ocean', 'mountain'],
    },
    text: {
      type: String,
      required: [true, 'Journal text is required'],
    },
    emotion: {
      type: String,
    },
    keywords: {
      type: [String],
    },
    summary: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Journal', journalSchema);
