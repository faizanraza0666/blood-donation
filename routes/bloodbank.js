const express = require("express");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

const getToken = require("../middleware/getUser");

const BloodBank = require("../models/bloodbank");
const Donor = require("../models/donor");
const Blood = require("../models/blood");

const router = express.Router();

router.get("/dashboard", getToken, (req, res) => {
  BloodBank.find()
    .then((bgroups) => {
      return res.status(200).json({ success: true, bgroups });
    })
    .catch((err) =>
      res.status(500).json({ success: false, error: err.message })
    );
});

router.post(
  "/donor_details",
  [
    body("name", "Name should be atleast 4 characters.")
      .trim()
      .isLength({ min: 4 }),
    body("email", "You must enter a valid email.").trim().isEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    Donor.create({
      dname: req.body.name,
      bgroup: req.body.bgroup,
      sex: req.body.sex,
      age: req.body.age,
      weight: req.body.weight,
      address: req.body.address,
      disease: req.body.disease,
      demail: req.body.email,
    })
      .then((donor) => res.redirect(`/AddDonor?id=${donor._id}`))
      .catch((err) =>
        res.status(500).json({ success: false, error: err.message })
      );
  }
);

router.get("/donor_logs", getToken, (req, res) => {
  Donor.find()
    .then((donorlogs) => res.status(200).json({ success: true, donorlogs }))
    .catch((err) =>
      res.status(500).json({ success: false, error: err.message })
    );
});

router.get("/logs/search", getToken, (req, res) => {
  const bgrp = req.query.bgroup;
  Donor.find({ bgroup: bgrp })
    .then((donorlogs) => {
      res.status(200).json({ success: true, donorlogs });
    })
    .catch((err) =>
      res.status(500).json({ success: false, error: err.message })
    );
});

router.post("/blood_details", (req, res) => {
  let blood_details;
  Blood.create({
    d_id: mongoose.Types.ObjectId(req.body.d_id),
    bgroup: req.body.bgroup,
    packets: req.body.packets,
  })
    .then((details) => {
      blood_details = details;
      BloodBank.updateOne(
        { bgroup: details.bgroup },
        {
          $inc: { tpackets: parseFloat(details.packets) },
        }
      )
        .then((result) =>
          res.redirect("/BloodDonor")
        )
        .catch((err) =>
          res.status(500).json({ success: false, error: err.message })
        );
    })
    .catch((err) =>
      res.status(500).json({ success: false, error: err.message })
    );
});

module.exports = router;
