const connectToMongo = require("./db");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const BloodBank = require("./models/bloodbank");
const Request = require("./models/requests");

const app = express();
const PORT = 8000;

app.use(cors());
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

connectToMongo();

function parseJwt(token) {
  var base64Url = token.split('.')[1]
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))

  return JSON.parse(jsonPayload)
};

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

app.get("/Homepage", async function(req, res) {
  const bloodDetails = await BloodBank.find()
  let user = {} 
  if (req.query.auth) {
    user = parseJwt(req.query.auth)
  }
  res.render('firstpage', { auth: req.query.auth, bloodDetails: bloodDetails, user: user })
});

app.get("/AddDonor", function(req, res) {
  let user = {}
  if (req.query.auth) {
    user = parseJwt(req.query.auth)
  }
  res.render('add_donor', { id: req.query.id, auth: req.query.auth })
});

app.get("/BloodRequests", function(req, res) {
  let user = {}
  if (req.query.auth) {
    user = parseJwt(req.query.auth)
  }
  res.render('blood_requests', { auth: req.query.auth })
});

app.get("/BloodDonor", function(req, res) {
  let user = {}
  if (req.query.auth) {
    user = parseJwt(req.query.auth)
  }
  res.render('blood_donate', { auth: req.query.auth })
});

app.get("/Requests", async function(req, res) {
  const requests = await Request.find()
  let user = {}
  if (req.query.auth) {
    user = parseJwt(req.query.auth)
  }
  let admin = false
  if (user.email === "455_bt19@iiitkalyani.ac.in") {
    admin = true
  }
  res.render('requests', { requests: requests, user: user, admin: admin, auth: req.query.auth })
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
