const express = require("express");
const tutorAuthRoutes = express.Router();

const tutorAuthController = require("../controllers/tutorAuthController");


tutorAuthRoutes.post("/register", tutorAuthController.registerTutor);
tutorAuthRoutes.post("/login", tutorAuthController.loginTutor);
tutorAuthRoutes.get("/logout", tutorAuthController.logout);
// tutorAuthRoutes.post("/forgotPassword", tutorAuthController.forgotPassword);
// tutorAuthRoutes.patch(
//   "/resetPassword/:token",
//   tutorAuthController.resetPassword
// );

module.exports = tutorAuthRoutes;

