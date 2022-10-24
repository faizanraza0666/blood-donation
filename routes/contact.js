const express = require("express");
const { body, validationResult } = require("express-validator");

const getToken = require("../middleware/getUser");
const Request = require("../models/requests");

const router = express.Router();

router.post("/", (req, res) => {
  Request.create({
    bgroup: req.body.bgroup,
    cpackets: req.body.packets,
    fullname: req.body.name,
    address: req.body.address,
  })
    .then((details) => res.redirect("/Requests"))
    .catch((err) =>
      res.status(500).json({ success: false, error: err.message })
    );
});

module.exports = router;
