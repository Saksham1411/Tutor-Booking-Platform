const express = require("express");
const studentRoutes = express.Router();

const studentController = require("../controllers/studentController");
const studentAuthController = require("../controllers/studentAuthController");
const reviewRouter = require("./reviewRoutes");
const multer = require("multer");

const storage = multer.memoryStorage();

const photosMiddleware = multer({ storage });
studentRoutes.use(studentAuthController.protect);   
studentRoutes.use("/reviews", reviewRouter);

studentRoutes.get("/me", studentController.getMe);
// studentRoutes.patch(
//     "/updateMe",
//     studentController.uploadStudentPhoto,
//     studentController.resizeStudentPhoto,
//     studentController.updateMe
//   );
studentRoutes.get("/updateMe",photosMiddleware.single('photo'),studentController.updateMe);

studentRoutes.get("/mySessions", studentController.getMySessions);

studentRoutes.delete("/deleteMe", studentController.deleteMe);
module.exports = studentRoutes;
