const Student = require("./../models/studentModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Booking = require("../models/bookingModel");
const Review = require("../models/reviewModel");
const Tutor = require("./../models/tutorModel");
const path = require("path");


const getAllSessions = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Session.find(), req.query)
      .filter()
      .sorting()
      .limiting()
      .paginating();
    const sessions = await features.query;
    res.status(200).json({
      status: "success",
      results: sessions.length,
      data: { sessions },
    });
  });

const createSession = catchAsync(async (req, res, next) => {
    const {  topics, subject, duration, price } = req.body;
    const tutorId = req.tutor._id;

    if(!tutorId)return next(new AppError("You can't create this session! ", 403));

    const newSession = new Session({ tutorId,class:req.body.class,subject,topics,duration,price });
    await newSession.save();
    res.status(201).json({
      status: "success",
      data: { session: newSession },
    });
  });