const express = require("express");
const { body, validationResult } = require("express-validator");

const getToken = require("../middleware/getUser");

const BloodBank = require("../models/bloodbank");
const Request = require("../models/requests");

const router = express.Router();

router.get("/", getToken, (req, res) => {
  Request.find()
    .then((details) => res.status(200).json({ success: true, details }))
    .catch((err) =>
      res.status(500).json({ success: false, error: err.message })
    );
});

router.get("/accept/:id", (req, res) => {
  const reqID = req.params.id;
  Request.findById(reqID)
    .then((notifs) => {
      BloodBank.findOne({ bgroup: notifs.bgroup })
        .then((details) => {
          if (details.tpackets < notifs.cpackets) {
            return res.status(204).json({
              success: false,
              error:
                "Not enough packets to process your request, wait for more stocks.",
            });
          }

          BloodBank.updateOne(
            { bgroup: notifs.bgroup },
            {
              $inc: { tpackets: -1 * parseFloat(notifs.cpackets) },
            }
          )
            .then((result) => {
              return Request.findByIdAndUpdate(reqID, { rstatus: "Accepted" });
            })
            .then(async (result) =>
              {
                await Request.deleteOne({ _id: reqID })
                res.redirect("/Homepage")}
            )
            .catch((err) =>{
              console.log(err)
              res.status(500).json({ success: false, error: err.message })}
            );
        })
        .catch((err) =>{
          console.log(err)
          res.status(500).json({ success: false, error: err.message })}
        );
    })
    .catch((err) =>{
      console.log(err)
    res.status(500).json({ success: false, error: err.message })}
    );
});

router.get("/decline/:id", async (req, res) => {
  await Request.deleteOne({ _id: req.params.id })
  res.redirect("/Homepage")
});

module.exports = router;
