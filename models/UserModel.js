const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  resetPasswordLink: {
    data: String,
    default: ""
  }
});

module.exports = mongoose.model("User", userSchema);
