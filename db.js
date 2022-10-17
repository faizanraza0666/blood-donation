const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://shadow:1234567890@cluster0.zaehv.mongodb.net/BBMS?retryWrites=true&w=majority";

const connectToMongo = () => {
  mongoose
    .connect(mongoURI)
    .then(() => console.log("connected to database successfully........."))
    .catch((err) => console.log(err));
};

module.exports = connectToMongo;
