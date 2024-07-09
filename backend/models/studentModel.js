const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: [true, "There is already an account with this email"],
        lowercase: true,
    },
    password:{
        type:String,
        required: [true, "Please provide a password"],
    },
    phoneNumber: {
        type: Number,
        required: [true, "Please provide your mobile number"],
    },
    address: {
        type: String,
        required: [true, "Please provide your address"],
    },
    photo:{
        type:String,
    }
},{timestamps:true})

const Student = mongoose.model("Student",studentSchema);
module.exports = Student;