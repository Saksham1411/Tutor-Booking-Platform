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
    }
})


const Session = mongoose.model("Session", sessionSchema);
module.exports = Session;