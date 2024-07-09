const Tutor = require('../models/tutorModel');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { StatusCodes } = require('http-status-codes');

const registerTutor = async (req, res) => {
    const { email, name, password, phoneNumber } = req.body;

    //password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //adding data to db
    const tutor = await Tutor.create({ email, password: hashedPassword, name, phoneNumber });

    //creating auth token
    const token = jwt.sign({ id: tutor._id, name, email }, process.env.JWT_SECRET);

    return res.cookie("token", token, { sameSite: 'none', secure: true }).status(201).json(tutor);
}
const loginTutor = async (req, res) => {
    const { email, password } = req.body;

    const tutor = await Tutor.findOne({ email });
    if (!tutor) return res.status(StatusCodes.UNAUTHORIZED).send("tutor not find");

    //Matching tutor
    const isMatched = bcrypt.compareSync(password, tutor.password);
    if (!isMatched) return res.status(StatusCodes.UNAUTHORIZED).send('Password not match');

    //creating jwt token
    const token = jwt.sign({ id: tutor._id, name:tutor.name, email }, process.env.JWT_SECRET);

    return res.cookie("token", token, { sameSite: 'none', secure: true }).status(201).json(tutor);
}

//for remain logged in 
const protect = async (req, res,next) => {
    const { token } = req.cookies;
    if (!token) return res.status(500).send('token not find');

    //verifying the token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const tutor = await Tutor.findOne({ _id: payload.id });
    req.tutor=tutor;
    next();
}

const logout = async (req, res) => {
    res.clearCookie("token").status(200).send('logout');
}

module.exports = { registerTutor, loginTutor, logout, protect }