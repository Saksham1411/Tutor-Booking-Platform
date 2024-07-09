const express = require("express");
const tutorRoutes = express.Router();

const tutorController = require("../controllers/tutorController");
const tutorAuthController = require("../controllers/tutorAuthController");
const multer = require("multer");

const storage = multer.memoryStorage();

const photosMiddleware = multer({ storage });

tutorRoutes.use(tutorAuthController.protect);
tutorRoutes.get("/me", tutorController.getMe);
tutorRoutes.patch(
    "/updateMe",photosMiddleware.single('photo'),
    tutorController.updateMe
  );

tutorRoutes.get("/myBookings", tutorController.getMyBookings);
tutorRoutes.get("/mySessions", tutorController.getMySessions);

tutorRoutes.delete("/deleteMe", tutorController.deleteMe);
module.exports = tutorRoutes;
