const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    tutorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor'
    },
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor'
    },
    comment: {
        type: String,
        required: [true, 'Please leave a comment...'],
        trim: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Please provide rating to add a review. "],
    },
},{timestamps:true});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;