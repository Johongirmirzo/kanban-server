const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose
      .connect(process.env.MONGODB_URI || "mongodb://localhost/ktmg")
      .then(() => {
        console.log("Database connection established!");
      });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = connectDB;
