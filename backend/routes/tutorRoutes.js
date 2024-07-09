const express = require("express");
const tutorRoutes = express.Router();

const tutorController = require("../controllers/tutorController");
const tutorAuthController = require("../controllers/tutorAuthController");

tutorRoutes.use(tutorAuthController.protect);
tutorRoutes.get("/me", tutorController.getMe);
tutorRoutes.patch(
    "/updateMe",
    tutorController.updateMe
  );

tutorRoutes.get("/mySessions", tutorController.getMySessions);

tutorRoutes.delete("/deleteMe", tutorController.deleteMe);
module.exports = tutorRoutes;
