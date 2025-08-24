const router= require('express').Router();
const MoodEntry= require('../models/MoodEntry');
const authMiddleware= require('../middleware/auth');

//Add authmiddleware to all routes
router.get('/', authMiddleware, async(req, res)=>{
    try{
        const entries= await MoodEntry.find({userId: req.userId}).sort( { date: -1 });
        res.json(entries);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});


//post a new mood entry
router.post('/', authMiddleware,async(req, res)=>{
    const newEntry = new MoodEntry({
        mood:req.body.mood,
        notes:req.body.notes,
        userId: req.userId
    });

    try{
        const savedEntry = await newEntry.save();
        res.status(201).json(savedEntry);
    } catch(err){
        res.status(400).json({ message: err.message });
    }
});


//delet a mood entry
router.delete('/:id',authMiddleware, async(req, res)=>{
    try{
        const entry= await MoodEntry.findOneAndDelete({_id: req.params.id, userId: req.userId});
        if(!entry) return res.status(404).json({ message: 'Entry not found' });
        res.json({ message: 'Entry deleted' });
    } catch(err){
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;