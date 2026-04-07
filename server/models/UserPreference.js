const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetMood: {
        type: String,
        required: true // e.g., 'Anxious', 'Sadness'
    },
    likedSuggestions: [{
        type: String // Array of advice strings they gave a Thumbs Up
    }],
    dislikedSuggestions: [{
        type: String // Array of advice strings they gave a Thumbs Down
    }]
});

module.exports = mongoose.model('UserPreference', userPreferenceSchema);