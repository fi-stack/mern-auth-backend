require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({
      message: "token not found",
    });
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);
  req.id = decode.id;
  next();
};
