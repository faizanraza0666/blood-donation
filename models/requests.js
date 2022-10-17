const mongoose = require("mongoose");
const { Schema } = mongoose;

const requestShema = new Schema({
  bgroup: { type: String, required: true },
  cpackets: { type: Number, required: true },
  fullname: { type: String, required: true },
  address: { type: String, required: true },
  rstatus: { type: String, required: true, default: "Pending" },
});

const Request = (module.exports = mongoose.model("Request", requestShema));
