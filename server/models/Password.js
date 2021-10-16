const mongoose = require("mongoose");

const passwordSchema = new mongoose.Schema({
  appName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  encryptedPassword: {
    type: String,
    required: true,
  },
  iv: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Password", passwordSchema);
