const express = require("express");
require("dotenv").config();
require("colors");
const morgan = require("morgan");
const mongoose = require("mongoose");

// Database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
      // useFindAndModify: false,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline.bold);
  } catch (err) {
    console.log(`Error: ${err.message}`.red);
    process.exit(1);
  }
};
connectDB();

// Initiate express
const app = express();

// Middleware
app.use(express.json());
app.use(morgan("tiny"));

// Routes

app.get("/", async (req, res) => {});

// Start listening
const PORT = process.env.PORT;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
