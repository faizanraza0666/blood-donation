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

router.get("/accept/:id", getToken, (req, res) => {
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
              $inc: { tpackets: -1 * parseFloat(notifs.packets) },
            }
          )
            .then((result) => {
              return Request.findByIdAndUpdate(reqID, { rstatus: "Accepted" });
            })
            .then((result) =>
              res
                .status(200)
                .json({ success: true, message: "Request accepted." })
            )
            .catch((err) =>
              res.status(500).json({ success: false, error: err.message })
            );
        })
        .catch((err) =>
          res.status(500).json({ success: false, error: err.message })
        );
    })
    .catch((err) =>
      res.status(500).json({ success: false, error: err.message })
    );
});

router.get("/decline/:id", getToken, (req, res) => {
  Request.findByIdAndUpdate(req.params.id, { rstatus: "Declined" })
    .then((result) => res.status(200).json({ success: true, result }))
    .catch((err) =>
      res.status(500).json({ success: false, error: err.message })
    );
});

module.exports = router;
