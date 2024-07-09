const path = require("path");
require("dotenv").config();
require('express-async-errors');
const app = require("./app");
const mongoose = require("mongoose");

//connection to database
const DB = process.env.MONGO_URI;

const connectionParams = {
  useNewUrlParser: true,
};

mongoose
  .connect(DB, connectionParams)
  .then((con) => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

