const express = require("express");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/users");
const config = require("../util/config");
const getToken = require("../middleware/getUser");

const router = express.Router();

//REGISTER:  new user at "/api/auth/register" without login required
router.post(
  "/register/user",
  [
    body("email", "Enter a valid email.").trim().isEmail(),
    body("name", "Name should be atleast 4 characters.")
      .trim()
      .isLength({ min: 4 }),
    body("password", "Password should be atleast 6 characters.")
      .trim()
      .isLength({ min: 6 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          return res.status(400).json({
            success: false,
            error: "User with this email already exists.",
          });
        }

        bcrypt
          .hash(req.body.password, 12)
          .then((hashedPassword) => {
            return User.create({
              name: req.body.name,
              password: hashedPassword,
              email: req.body.email,
            });
          })
          .then((user) => res.redirect('/login'))
          .catch((err) =>
            res.status(500).json({ success: false, error: err.message })
          );
      })
      .catch((err) =>
        res.status(500).json({ success: false, error: err.message })
      );
  }
);

router.post(
  "/register/admin",
  [
    body("email", "Enter a valid email.").trim().isEmail(),
    body("name", "Name should be atleast 4 characters.")
      .trim()
      .isLength({ min: 4 }),
    body("password", "Password should be atleast 6 characters.")
      .trim()
      .isLength({ min: 6 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          return res.status(400).json({
            success: false,
            error: "User with this email already exists.",
          });
        }

        bcrypt
          .hash(req.body.password, 12)
          .then((hashedPassword) => {
            return User.create({
              name: req.body.name,
              password: hashedPassword,
              email: req.body.email,
              ustatus: "Admin",
            });
          })
          .then((user) => res.status(200).json({ success: true, user }))
          .catch((err) =>
            res.status(500).json({ success: false, error: err.message })
          );
      })
      .catch((err) =>
        res.status(500).json({ success: false, error: err.message })
      );
  }
);

//LOGIN: existing user at "/api/auth/login" without login required
router.post(
  "/login",
  [
    body("email", "Please enter a valid email.").trim().isEmail(),
    body("password", "Please login with valid credentials.")
      .trim()
      .isLength({ min: 6 })
      .exists(),
  ],
  (req, res) => {
  
    const errors = validationResult(req);
    console.log(req.body)
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.status(400).json({
            success: false,
            error: "Please login with valid credentials.",
          });
        }

        bcrypt
          .compare(req.body.password, user.password)
          .then((doMatch) => {
            if (!doMatch) {
              return res.status(400).json({
                success: false,
                error: "Please login with valid credentials.",
              });
            }

            const userT = user.toJSON()
            delete userT["password"]

            const authToken = jwt.sign(userT, config.secretKey, {
              expiresIn: "24h",
            });

            return res.redirect(`/Homepage?auth=${authToken}`);
          })
          .catch((err) =>
            res.status(500).json({ success: false, error: err.message })
          );
      })
      .catch((err) =>
        res.status(500).json({ success: false, error: err.message })
      );
  }
);

// //GET DETAILS: existing user at "/api/auth/getuser" with login required
// router.post("/getuser", getToken, async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const user = await User.findById(userId).select("-password");
//     res.status(200).json({ success: true, user });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// router.get("/getallusers", (req, res) => {
//   User.find()
//     .then((users) => {
//       return res.status(200).json({ success: true, users });
//     })
//     .catch((err) =>
//       res.status(500).json({ success: false, error: err.message })
//     );
// });

module.exports = router;
