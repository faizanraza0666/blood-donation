const connectToMongo = require("./db");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 8000;

app.use(cors());
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

connectToMongo();

//available routes
// app.use("/api/", (req, res) => {
//   return res
//     .status(200)
//     .json({ success: true, message: "Welcome to BBMS api." });
// });

app.get("/login", function(req, res) {
  res.render('login')
});

app.get("/register", function(req, res) {
  res.render('register')
});

app.get("/Homepage", function(req, res) {
  res.render('firstpage', {auth: req.query.auth})
});

app.get("/AddDonor", function(req, res) {
  res.render('add_donor', {id: req.query.id})
});

app.get("/BloodRequests", function(req, res) {
  res.render('blood_requests')
});

app.get("/BloodDonor", function(req, res) {
  res.render('blood_donate')
});

app.get("/Requests", function(req, res) {
  res.render('requests')
});

app.get('/style.css', function(req, res) {
  res.sendFile(__dirname + "/css/style.css");
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/bloodbank", require("./routes/bloodbank"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/notifications", require("./routes/notifications"));

app.listen(PORT, () => {
  console.log(`Connected to express server at http://localhost:${PORT}`);
});
