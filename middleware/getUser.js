const jwt = require("jsonwebtoken");
const config = require("../util/config");

const getToken = (req, res, next) => {
  const token = req.headers["auth-token"];
  if (!token) {
    res
      .status(401)
      .json({ success: false, error: "Please login with valid token." });
  }
  try {
    const data = jwt.verify(token, config.secretKey);
    req.user = data.user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, error: "Please login with valid token." });
  }
};

module.exports = getToken;
