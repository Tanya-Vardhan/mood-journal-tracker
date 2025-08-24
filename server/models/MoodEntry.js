
const mongoose = require('mongoose');

const MoodEntrySchema = new mongoose.Schema({
  mood: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

module.exports = mongoose.model('MoodEntry', MoodEntrySchema);