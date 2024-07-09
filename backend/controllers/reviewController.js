const Review = require('../models/reviewsModel');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const Session = require('../models/sessionModel');

const getAllReviewOfTutor = async (req, res) => {
    const { tutorId } = req.params;

    const reviews = await Review.find({ tutorId });

    res.status(StatusCodes.OK).send(reviews);
}

const createReview = async (req, res) => {
    const { comment, rating } = req.body;
    const { sessionId } = req.params;
    const { token } = req.cookies;

    if (!token) return res.status(StatusCodes.UNAUTHORIZED).send("User not logged in ");
    //verify jwt token to get id of logged in user
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    //for geting the tutorId who created the session
    const session = await Session.find({ _id: sessionId });

    //creating review
    const review = await Review.create({ studentId: payload.id, sessionId, tutorId: session.tutorId, comment, rating });

    res.status(StatusCodes.CREATED).send("Review added successfully ");
}

const getReview = async (req, res) => {
    const { sessionId } = req.params;

    const reviews = (await Review.find({ sessionId })).populate('studentId');

    res.status(StatusCodes.OK).send(reviews);
}

const updateReview = async (req, res) => {
    const { comment, rating } = req.body;
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate({ _id: reviewId }, { comment, rating });

    res.status(StatusCodes.OK).send("updated succesfully");

}

const deleteReview = async (req, res) => {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete({ _id: reviewId });

    res.status(StatusCodes.OK).send("Deleted succesfully");
}

module.exports = { getAllReviewOfTutor, createReview, getReview, updateReview, deleteReview }; 