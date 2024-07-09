const mongoose = require('mongoose');
const Session=require('./sessionModel');
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


//pipeline for calculating average rating whenever a new review is created
reviewSchema.statics.calAverageRatings = async function (sessionId) {
    const stats = await this.aggregate([
      {
        $match: { sessionId: sessionId },
      },
      {
        $group: {
          _id: "$session",
          nRating: { $sum: 1 },
          avgRating: { $avg: "$rating" },
        },
      },
    ]);
    if (stats.length > 0) {
      await Session.findByIdAndUpdate(sessionId, {
        rating: stats[0].avgRating,
      });
    } else {
      await Session.findByIdAndUpdate(sessionId, {
        rating: 4.5,
      });
    }
  };
  
//both findbyidAnd ==findOneAnd in back
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne().clone(); //to get the document from query as we are completing findOne
    //clone is used because mongoose v6 do not allow same query twice.
    next();
  });
  reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calAverageRatings(this.r.sessionId);
  });
  

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;