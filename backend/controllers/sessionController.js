const Student = require("./../models/studentModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const Session = require("./../models/sessionModel");
const path = require("path");

const getAllSessions = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Session.find(), req.query)
    .filter()
    .sorting()
    .limiting();
    // .paginating();
  const sessions = await features.query;
  res.status(200).json({
    status: "success",
    results: sessions.length,
    data: { sessions },
  });
});

const createSession = catchAsync(async (req, res, next) => {
  const { topics, subject, duration, price } = req.body;
  const tutorId = req.tutor.id;

  if (!tutorId)
    return next(new AppError("You can't create this session! ", 403));

  const newSession = new Session({
    tutorId,
    class: req.body.class,
    subject,
    topics,
    duration,
    price,
  });
  await newSession.save();
  res.status(201).json({
    status: "success",
    data: { session: newSession },
  });
});

const getSession = catchAsync(async (req, res, next) => {
  const sessionId = req.params.sessionId;
  const session = await Session.findById(sessionId).populate({
    path: "tutor",
    select: "name photo _id",
  });
  res.status(201).json({
    status: "success",
    data: { session: session },
  });
});

const updateSession = catchAsync(async (req, res, next) => {
  const sessionId = req.params.sessionId;
  const previousSession = await Session.findById(sessionId);
  
 
  if (previousSession.tutorId != req.tutor.id)
    return next(
      new AppError("You can not update or delete this session! ", 403)
    );

    const newSession=req.body;
  const session = await Session.findByIdAndUpdate(
    sessionId,
    newSession ,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      session: session,
    },
  });
});


const deleteSession = catchAsync(async (req, res, next) => {
    const sessionId = req.params.sessionId;
    const previousSession = await Session.findById(sessionId);
  
    if (previousSession.tutorId != req.tutor._id)
      return next(
        new AppError("You can not update or delete this session! ", 403)
      );
  
    const session = await Session.findByIdAndDelete(
      sessionId,
    );
  
    res.status(200).json({
      status: "success",
    });
  });

  module.exports = { getAllSessions, createSession,getSession, updateSession, deleteSession };
  