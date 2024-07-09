const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    studentId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    sessionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session'
    },
    startingDate: {
        type: Date,
        required: [true, "Booking must have a starting date"],
    },
    endingDate: {
        type: Date,
        required: [true, "Booking must have a ending date"],
    },
    paymentStatus:{
        type:Boolean,
        default:false
    }
},{timestamp:true});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;