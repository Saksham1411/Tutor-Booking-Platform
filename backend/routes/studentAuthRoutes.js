const express = require("express");
const studentAuthRoutes = express.Router();

const studentAuthController = require("../controllers/studentAuthController");


studentAuthRoutes.post("/register", studentAuthController.registerStudent);
studentAuthRoutes.post("/login", studentAuthController.loginStudent);
studentAuthRoutes.get("/logout", studentAuthController.logout);
// studentAuthRoutes.post("/forgotPassword", studentAuthController.forgotPassword);
// studentAuthRoutes.patch(
//   "/resetPassword/:token",
//   studentAuthController.resetPassword
// );

module.exports = studentAuthRoutes;

