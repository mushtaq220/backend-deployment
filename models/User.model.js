const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide unique Username"],
    unique: [true, "Username Exist"],
  },
  email: {
    type: String,
    required: [true, "please provide a email"],
    unique: true,
  },
  gender: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please provide a Password"],
    unique: false,
  },
  age: {
    type: Number,
  },
  city: {
    city: String,
  },
});

const Usermodel = mongoose.model("user", userSchema);

module.exports = { Usermodel };
