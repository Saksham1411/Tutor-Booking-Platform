const Student = require("./../models/studentModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");
const Review = require("./../models/reviewModel");
const Booking =require("./../models/bookingModel");
const path = require("path");

const getAllReviews = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Review.find(), req.query);
    // .filter()
    // .sorting()
    // .limiting()
    // .paginating();
  const reviews = await features.query;
  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews },
  });
});

const createReview = catchAsync(async (req, res, next) => {
    const { comment, rating } = req.body;
    const { sessionId } = req.params;

    const booking = await Booking.findOne({
        sessionId: req.params.sessionId,
        studentId: req.student._id,
      });
      if (!booking)
        return next(new AppError("You can't create this review! ", 403));

      req.body.sessionId = req.params.sessionId;
      req.body.studentId = req.student._id;
    
      const newReview = await Review.create({
        ...req.body,
      });
    
      res.status(200).json({
        status: "success",
        data: {
          Review: newReview,
        },
      });
});

const getReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const review = await Review.findById(reviewId).populate({
    path: "studentId",
    select: "name photo _id",
  });
  res.status(201).json({
    status: "success",
    data: { review: review },
  });
});

const updateReview = catchAsync(async (req, res, next) => {
  const reviewId = req.params.reviewId;
  const previousReview = await Review.findById(reviewId);

  if (previousReview.studentId != req.student.id)
    return next(
      new AppError("You can not update or delete this review! ", 403)
    );

    const newReview=req.body;
  const review = await Review.findByIdAndUpdate(
    reviewId,
    newReview ,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      review: review,
    },
  });
});


const deleteReview = catchAsync(async (req, res, next) => {
    const reviewId = req.params.reviewId;
    const previousReview = await Review.findById(reviewId);
  
    if (previousReview.studentId != req.student._id)
      return next(
        new AppError("You can not update or delete this review! ", 403)
      );
  
    const review = await Review.findByIdAndDelete(
      reviewId,
    );
  
    res.status(200).json({
      status: "success",
    });
  });

  module.exports = { getAllReviews, createReview,getReview, updateReview, deleteReview };
  