const Student = require("./../models/studentModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Booking = require("../models/bookingModel");
const Review = require("../models/reviewModel");
const Tutor = require("./../models/tutorModel");
const path = require("path");
const multer = require("multer");

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not a image! Please upload only image. ", 400));
  }
};
const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 10000000 },
});

const uploadStudentPhoto = upload.single("photo");
const resizeStudentPhoto = (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `customer-${req.Customer._id}-${Date.now()}.jpeg`;
  // sharp(req.file.buffer)
  //   .resize(500, 500)
  //   .toFormat("jpeg")
  //   .jpeg({ quality: 90 })
  //   .toFile(`server/Images/customers/${req.file.filename}`);
  // next();
};

const getMe = catchAsync(async (req, res) => {
  const student = await Student.findById(req.student._id);
  res.status(200).json({
    status: "success",
    student,
  });
});

exports.sendImage = (req, res) => {
  res.sendFile(
    path.resolve(`${__dirname}/../Images/customers/${req.params.fileName}`)
  );
};


//// ---- Need to test dates ----
const getMySessions = catchAsync(async (req, res, next) => {
  const currentSessions = await Booking.find({
    studentId: req.student._id,
    endingDate: { $gt: new Date(Date.now()) },
  })
    .populate({ path: "tutorId", select: "name photo _id" })
    .populate({ path: "sessionId", select: "class subject topics" });

  const pastSessions = await Booking.find({
    student: req.student._id,
    endingDate: { $lt: new Date(Date.now())},
  }) .populate({ path: "tutorId", select: "name photo _id" })
  .populate({ path: "sessionId", select: "class subject topics" });

  const upcomingSessions = await Booking.find({
    student: req.student._id,
    startingDate: { $gt: new Date(Date.now())},
  }) .populate({ path: "tutorId", select: "name photo _id" })
  .populate({ path: "sessionId", select: "class subject topics" });

  res.status(200).json({
    status: "success",
    data: {
      CurrentBookings: currentBookings,
      PastBookings: pastBookings,
      upcomingSessions: upcomingSessions
    },
  });
});

const getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({
    student: req.student._id,
  }).populate({ path: "sessionId", select: "class subject topics" });

  res.status(200).json({
    status: "success",
    data: {
      reviews: reviews,
    },
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  
  // 1) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    "name",
    "email",
  );
  
  const updatedStudent = await Student.findByIdAndUpdate(
    req.student._id,
    filteredBody,
    {
      new: true, //returns new object
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    sustomer: updatedStudent,
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const deleteMe = catchAsync(async (req, res, next) => {
  await student.findByIdAndUpdate(req.student.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = { getMe,updateMe,getMySessions,deleteMe,uploadStudentPhoto,resizeStudentPhoto }
