const express = require("express");
const tutorRoutes = express.Router();

const tutorController = require("../controllers/tutorController");
const tutorAuthController = require("../controllers/tutorAuthController");
const sessionRouter=require('./sessionRoutes');

tutorRoutes.use(tutorAuthController.protect);

tutorRoutes.get("/me", tutorController.getMe);
tutorRoutes.patch(
    "/updateMe",
    tutorController.uploadtutorPhoto,
    tutorController.resizetutorPhoto,
    tutorController.updateMe
  );

tutorRoutes.get("/mySessions", tutorController.getMySessions);
tutorRoutes.get("/sessions",sessionRouter);

tutorRoutes.delete("/deleteMe", tutorController.deleteMe);
module.exports = tutorRoutes;
