// Modules
const express = require("express");
require("dotenv").config();
require("colors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// Routes import
const authRoutes = require("./routes/auth");
const passwordRoutes = require("./routes/password");

// Database connect
mongoose.connect(process.env.MONGO_URI, {}, (error) => {
  if (!error) {
    console.log("Connected to mongoDB".cyan.underline.bold);
  } else {
    console.log(error);
  }
});

// Initiate express
const app = express();

// Middleware
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("tiny"));
}
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "https://vibrant-cray-bdff94.netlify.app",
  })
); // pass to allow http cookie to go through

// Routes
app.use("/auth", authRoutes);
app.use("/password", passwordRoutes);

// Start listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));
