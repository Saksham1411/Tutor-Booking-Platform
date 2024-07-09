const express = require("express");
const reviewRoutes = express.Router();

const { getAllReviewOfTutor, createReview, getReview, updateReview, deleteReview } = require('../controllers/reviewController');

reviewRoutes.route('/:sessionId').post(createReview).get(getReview);
reviewRoutes.patch('/updateReview/:reviewId', updateReview);
reviewRoutes.delete('/deleteReview/:reviewId', deleteReview);
reviewRoutes.get('/tutorReview/:tutorId', getAllReviewOfTutor)

module.exports = reviewRoutes;