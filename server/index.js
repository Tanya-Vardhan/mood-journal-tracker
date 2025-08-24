const express= require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

//middleware
app.use(cors());// for cross-origin sharing between frontend and backend 
app.use(express.json());// for parsing JSON bodies

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error(error);
}); 

//routes
const authRouter= require('./routes/auth');
const moodEntriesRouter= require('./routes/moodEntries');
app.use('/api/auth', authRouter);
app.use('/api/moods', moodEntriesRouter);// example of middleware in express.js

//basic check route
app.get('/',(req,res)=>{
    res.send('Server is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

