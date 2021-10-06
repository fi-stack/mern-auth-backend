const express = require("express");
const router = express.Router();
const {
  RegisterUser,
  LoginUser,
  getUser,
  forgotPassword,
  resetPassword,
} = require("../controller/UserController");
const {
  runValidation,
  validationRegister,
  validationLogin,
} = require("../validation");
const middleware = require("../middleware/middleware");

router.post("/register", validationRegister, runValidation, RegisterUser);
router.post("/login", validationLogin, runValidation, LoginUser);
router.get("/user", middleware, getUser);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);

module.exports = router;
