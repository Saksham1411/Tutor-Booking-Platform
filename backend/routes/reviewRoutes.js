const express = require("express");
const reviewRouter = express.Router({ mergeParams: true });
const reviewController = require("./../controllers/reviewController");
const studentAuthController = require("../controllers/studentAuthController");


reviewRouter.get("/",reviewController.getAllReviews);

reviewRouter.use(studentAuthController.protect);

reviewRouter.post("/createReview/:sessionId",reviewController.createReview);
reviewRouter
  .route("/:reviewId")
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = reviewRouter;
