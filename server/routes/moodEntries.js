// const router= require('express').Router();
// const MoodEntry= require('../models/MoodEntry');
// const authMiddleware= require('../middleware/auth');

// //Add authmiddleware to all routes

// // Security: authMiddleware is inserted before the main handler. This ensures that the handler code only 
// // runs after the user's token has been validated and the req.userId has been set.
// router.get('/', authMiddleware, async(req, res)=>{
//     try{
//         const entries= await MoodEntry.find({userId: req.userId}).sort( { date: -1 });
//         res.json(entries);
//     }
//     catch(err){
//         res.status(500).json({message: err.message});
//     }
// });


// //post a new mood entry
// router.post('/', authMiddleware,async(req, res)=>{
//     const newEntry = new MoodEntry({
//         mood:req.body.mood,
//         notes:req.body.notes,
//         userId: req.userId
//     });

//     try{
//         const savedEntry = await newEntry.save();
//         res.status(201).json(savedEntry);
//     } catch(err){
//         res.status(400).json({ message: err.message });
//     }
// });


// //delet a mood entry
// router.delete('/:id',authMiddleware, async(req, res)=>{
//     try{
//         const entry= await MoodEntry.findOneAndDelete({_id: req.params.id, userId: req.userId});
//         if(!entry) return res.status(404).json({ message: 'Entry not found' });
//         res.json({ message: 'Entry deleted' });
//     } catch(err){
//         res.status(500).json({ message: err.message });
//     }
// });

// module.exports = router;

const router = require('express').Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const MoodEntry = require('../models/MoodEntry');
const UserPreference = require('../models/UserPreference');
const authMiddleware = require('../middleware/auth');

// Initialize Gemini (Ensure your .env has GEMINI_API_KEY)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --------------------------------------------------------
// GET: Fetch all mood entries for the logged-in user
// --------------------------------------------------------
router.get('/', authMiddleware, async (req, res) => {
    try {
        const entries = await MoodEntry.find({ userId: req.userId }).sort({ date: -1 });
        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --------------------------------------------------------
// POST: Create a new entry (Two-Step Gemini Pipeline)
// --------------------------------------------------------
router.post('/', authMiddleware, async (req, res) => {
    const { notes, userFeeling } = req.body;

    if (!notes || !userFeeling) {
        return res.status(400).json({ message: "Both feeling and notes are required." });
    }

    try {
        // Configure Gemini to strictly return JSON objects
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" } 
        });

        // ========================================================
        // STEP 1: Detect the Highly Specific Mood
        // ========================================================
        const moodPrompt = `
            Analyze this journal entry:
            User's stated feeling: "${userFeeling}"
            Journal notes: "${notes}"

            Identify the primary underlying mood. Be highly specific (e.g., "Overwhelmed", "Burnt Out", "Anxious", "Peaceful", "Motivated"). 
            Respond with a JSON object containing exactly two keys: "mood" (string) and "confidence" (number between 0.00 and 1.00).
        `;
        
        const moodResult = await model.generateContent(moodPrompt);
        const moodData = JSON.parse(moodResult.response.text());
        const detectedMood = moodData.mood;
        const confidence = moodData.confidence;

        // ========================================================
        // STEP 2: Fetch History for THAT Specific Mood
        // ========================================================
        let prefs = await UserPreference.findOne({ 
            userId: req.userId, 
            targetMood: detectedMood 
        });

        const liked = prefs && prefs.likedSuggestions.length > 0 
            ? prefs.likedSuggestions.join('. ') 
            : "No previous data for this mood.";
            
        const disliked = prefs && prefs.dislikedSuggestions.length > 0 
            ? prefs.dislikedSuggestions.join('. ') 
            : "No previous data for this mood.";

        // ========================================================
        // STEP 3: Generate the Personalized Suggestion
        // ========================================================
        const suggestionPrompt = `
            You are an empathetic journaling assistant. 
            The user is currently feeling: ${detectedMood}.
            They wrote: "${notes}"

            Here is what has helped them when they felt ${detectedMood} in the past: ${liked}
            Here is what they DO NOT like when feeling ${detectedMood}: ${disliked}

            Provide ONE short, highly effective, actionable suggestion (1-2 sentences max) to help them right now. 
            Do not repeat exactly what they liked, but follow that same style.
            Respond with a JSON object containing exactly one key: "suggestion" (string).
        `;

        const suggestionResult = await model.generateContent(suggestionPrompt);
        const suggestionData = JSON.parse(suggestionResult.response.text());

        // ========================================================
        // STEP 4: Save to DB and Send Response
        // ========================================================
        const newEntry = new MoodEntry({
            mood: detectedMood,
            userFeeling: userFeeling,
            notes: notes,
            userId: req.userId,
            confidenceScore: confidence 
        });

        const savedEntry = await newEntry.save();

        res.status(201).json({
            entry: savedEntry,
            ai_data: {
                confidence: confidence,
                message: `AI detected ${detectedMood} with ${Math.round(confidence * 100)}% confidence.`
            },
            suggestion: suggestionData.suggestion
        });

    } catch (err) {
        console.error("Error processing entry:", err.message);
        res.status(500).json({ message: "Failed to process entry with Gemini." });
    }
});

// --------------------------------------------------------
// POST: Save user feedback (Thumbs Up / Thumbs Down)
// --------------------------------------------------------
router.post('/feedback', authMiddleware, async (req, res) => {
    const { targetMood, suggestionText, rating } = req.body;

    if (!targetMood || !suggestionText || !rating) {
        return res.status(400).json({ message: "Missing required feedback fields." });
    }

    try {
        let prefs = await UserPreference.findOne({ userId: req.userId, targetMood });

        if (!prefs) {
            prefs = new UserPreference({ userId: req.userId, targetMood });
        }

        if (rating === 'like') {
            if (!prefs.likedSuggestions.includes(suggestionText)) {
                prefs.likedSuggestions.push(suggestionText);
            }
        } else if (rating === 'dislike') {
            if (!prefs.dislikedSuggestions.includes(suggestionText)) {
                prefs.dislikedSuggestions.push(suggestionText);
            }
        }

        await prefs.save();
        res.status(200).json({ message: "Feedback recorded successfully!" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --------------------------------------------------------
// DELETE: Delete a mood entry
// --------------------------------------------------------
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const entry = await MoodEntry.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!entry) return res.status(404).json({ message: 'Entry not found' });
        res.json({ message: 'Entry deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;