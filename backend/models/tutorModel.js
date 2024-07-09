const mongoose = require('mongoose');

const TutorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name"],
        trim: true,
    },
       isTutor:{
        type:Boolean,
        required:true,
        default:true,
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: [true, "There is already an account with this email"],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    phoneNumber: {
        type: Number,
        required: [true, "Please provide your mobile number"],
    },
    sessions: {
        type: [String],
    },
    photo:{
        type:String,
    }
},{timestamps:true});

const Tutor =  mongoose.model("Tutor", TutorSchema);
module.exports = Tutor;
