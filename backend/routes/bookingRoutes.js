const express = require("express");
const bookingRouter = express.Router();
const bookingController = require("./../controllers/bookingController");
const studentAuthController = require("./../controllers/studentAuthController");

bookingRouter.post(
  "/checkout-session/:sessionId",
  studentAuthController.protect,
  bookingController.getCheckoutSession
);
module.exports = bookingRouter;
