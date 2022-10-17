const mongoose = require("mongoose");
const { Schema } = mongoose;

const donorShema = new Schema({
  dname: { type: String, required: true },
  bgroup: { type: String, required: true },
  sex: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  address: { type: String, required: true },
  disease: { type: String, required: true },
  demail: { type: String, required: true },
  ddate: { type: Date, default: Date.now },
});

const Donor = (module.exports = mongoose.model("Donor", donorShema));
