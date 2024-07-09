const Student = require('../models/studentModel');
const bcrypt = require('bcryptjs');
const { StatusCodes } = require('http-status-codes');

const registerStudent = async (req, res) => {
    const { email, name, password, phoneNumber, address } = req.body;

    //password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //adding data to db
    const student = await Student({ email, password: hashedPassword, name, phoneNumber, address });

    //creating auth token
    const token = jwt.sign({ id: student._id, name, email }, process.env.JWT_SECRET);

    return res.cookie("token", token, { sameSite: 'none', secure: true }).status(201).json(student);
}
const loginStudent = async (req, res) => {
    const { email, password } = req.body;

    const student = await Student.find({ email });
    if (!student) return res.send(StatusCodes.UNAUTHORIZED).send("Student not find");

    const isMatched = bcrypt.compareSync(password, student.password);
    if (!isMatched) return res.status(StatusCodes.UNAUTHORIZED).send('Password not match');

    const token = jwt.sign({ id: student._id, name, email }, process.env.JWT_SECRET);

    return res.cookie("token", token, { sameSite: 'none', secure: true }).status(201).json(student );
}

//for remaining logged in 
const profile = async (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.status(500).send('token not find');

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const student = await User.findOne({ _id: payload.id });
    res.status(StatusCodes.OK).json(student);
}

const logout = async (req, res) => {
    res.clearCookie("token").status(200).send('logout');
}



module.exports = { registerStudent, loginStudent, logout,profile }