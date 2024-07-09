const Student = require("./../models/tutorModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Booking = require("../models/bookingModel");
const Review = require("../models/reviewModel");
const Tutor = require("./../models/tutorModel");
const Session =require("./../models/sessionModel");
const path = require("path");

const multer = require("multer");
const DatauriParser = require('datauri/parser');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const parser = new DatauriParser();

const imageUploader = async (image)=>{
  const extName = path.extname(image.originalname).toString();
    const file = parser.format(extName, image.buffer);

    const result = await cloudinary.uploader.upload(file.content);
    console.log(result.url);
    return result.url;
}

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new AppError("Not a image! Please upload only image. ", 400));
//   }
// };
// const multerStorage = multer.memoryStorage();

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
//   limits: { fileSize: 10000000 },
// });

// const uploadStudentPhoto = upload.single("photo");
// const resizeStudentPhoto = (req, res, next) => {
//   if (!req.file) return next();
//   req.file.filename = `customer-${req.Customer._id}-${Date.now()}.jpeg`;
//   // sharp(req.file.buffer)
//   //   .resize(500, 500)
//   //   .toFormat("jpeg")
//   //   .jpeg({ quality: 90 })
//   //   .toFile(`server/Images/customers/${req.file.filename}`);
//   // next();
// };

const getMe = catchAsync(async (req, res) => {
  const tutor = await Tutor.findById(req.tutor._id);
  res.status(200).json({
    status: "success",
    tutor,
  });
});

exports.sendImage = (req, res) => {
  res.sendFile(
    path.resolve(`${__dirname}/../Images/customers/${req.params.fileName}`)
  );
};


//// ---- Need to test dates ----
const getMyBookings = catchAsync(async (req, res, next) => {
  const currentBookings = await Booking.find({
    tutorId: req.tutor._id,
    endingDate: { $gt: new Date(Date.now()) },
  })
    .populate({ path: "studentId", select: "name photo _id" })
    .populate({ path: "sessionId", select: "class subject topics" });

  const pastBookings = await Booking.find({
    tutor: req.tutor._id,
    endingDate: { $lt: new Date(Date.now())},
  }) .populate({ path: "studentId", select: "name photo _id" })
  .populate({ path: "sessionId", select: "class subject topics" });

  const upcomingBookings = await Booking.find({
    tutor: req.tutor._id,
    startingDate: { $gt: new Date(Date.now())},
  }) .populate({ path: "studentId", select: "name photo _id" })
  .populate({ path: "sessionId", select: "class subject topics" });

  res.status(200).json({
    status: "success",
    data: {
      CurrentBookings: currentBookings,
      PastBookings: pastBookings,
      upcomingSessions: upcomingBookings
    },
  });
});

const getMySessions=catchAsync(async (req, res, next) => {

  const sessions=await Session.find({tutorId:req.tutor.id});

  res.status(200).json({
    status: "success",
    data: {
      sessions:sessions
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

  if(req.file){
    url = await imageUploader(req.file);
    filteredBody.photo = url;
  }

  
  const updatedTutor = await Tutor.findByIdAndUpdate(
    req.tutor.id,
    filteredBody,
    {
      new: true, //returns new object
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    sustomer: updatedTutor,
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
  await Tutor.findByIdAndUpdate(req.tutor.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

module.exports = { getMe,updateMe,getMyBookings,getMySessions,deleteMe }
