const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.connect("mongodb://localhost/tkmg").then(() => {
      console.log("Database connection established!");
    });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = connectDB;
