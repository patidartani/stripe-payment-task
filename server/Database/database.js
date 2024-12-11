const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/STRIPE_PAYMENT_TASK"
    );
    console.log("Database connected sucessfully!");
  } catch (error) {
    console.error(`Error in connecting with database: ${error.message}`);
  }
};

module.exports = connectDb;
