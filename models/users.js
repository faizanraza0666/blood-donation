const mongoose = require("mongoose");
const { Schema } = mongoose;

const userShema = new Schema({
  ustatus: { type: String, required: true, default: "User" },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const User = (module.exports = mongoose.model("User", userShema));
