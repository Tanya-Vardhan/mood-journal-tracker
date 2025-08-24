// this file if for defining schema for a user, including usernmam and password
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    }
});

//Salting the password before saving it to the database
//pre-save hook
userSchema.pre('save', async function(next){

    //condition checks if the password is modified, if not it will not hash again
    if(this.isModified('password')){
        //hash the password: gensalt(x): x is the number of rounds to use, higher the number more secure but slower
        const salt= await bcrypt.genSalt(10);
        this.password= await bcrypt.hash(this.password, salt);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);// (name, schema)