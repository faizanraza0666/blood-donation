const mongoose = require("mongoose");
const { Schema } = mongoose;

const bloodbankShema = new Schema({
  bgroup: { type: String, required: true, unique: true },
  tpackets: { type: Number, required: true },
});

const BloodBank = (module.exports = mongoose.model(
  "BloodBank",
  bloodbankShema
));
