const mongoose = require('mongoose');

const moodEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userFeeling: { 
    type: String, required: true 
  },
  notes: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    required: true,
  },
  confidenceScore: {
    type: Number,
    required: true // We added this to store the AI's confidence (e.g., 0.92)
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MoodEntry', moodEntrySchema);