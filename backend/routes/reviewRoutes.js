const express = require("express");
const reviewRoutes = express.Router();

const { getAllReviewOfTutor, createReview, getReview, updateReview, deleteReview } = require('../controllers/reviewController');

reviewRoutes.route('/reviews/:sessionId').post(createReview).get(getReview);
reviewRoutes.patch('/reviews/updateReview/:reviewId', updateReview);
reviewRoutes.delete('/reviews/deleteReview/:reviewId', deleteReview);
reviewRoutes.get('/reviews/tutorReview/:tutorId', getAllReviewOfTutor)




module.exports = reviewRoutes;