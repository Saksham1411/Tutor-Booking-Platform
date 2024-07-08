require('dotenv').config();
const express = require('express');
const connectDB = require('./config/connectDB');
const cors = require('cors');

const PORT = process.env.PORT || 8000;

const app = express();

//middlewares
app.use(express.json());
app.use(cors());


//routes



connectDB(process.env.MONGO_URI);
app.listen(PORT,()=>console.log('server started...'));