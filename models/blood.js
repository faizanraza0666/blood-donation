const mongoose = require("mongoose");
const { Schema } = mongoose;

const bloodSchema = new Schema({
  d_id: { type: Schema.Types.ObjectId, ref: "Donor", required: true },
  bgroup: { type: String, required: true },
  packets: { type: Number, required: true },
});

const Blood = (module.exports = mongoose.model("Blood", bloodSchema));
