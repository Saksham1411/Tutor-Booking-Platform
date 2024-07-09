const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    tutorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tutor'
    },
    class:{
        type:Number,
        required:[true,"Please provide for which"]
    },
    subject:{
        type:String,
        required:[true,"Please provide the subject.."],
    },
    topics:{
        type:[String],
        required:[true,"Please provide the topics.."],
    },
    duration:{
        type:Number,
        required:[true,"Please provide the session duration"]
    },
    price:{
        type:Number,
        required:[true,"Please provide the session cost"]
    },
    rating:{
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    }
})


const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;