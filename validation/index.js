const { check, validationResult } = require("express-validator");

exports.runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({
      success: false,
      message: errors.array()[0].msg,
    });
  }
  next();
};

exports.validationRegister = [
  check("username", "username tidak boleh kosong").notEmpty(),
  check("email", "email tidak boleh kosong")
    .notEmpty()
    .matches(/.+@.+..+/)
    .withMessage("email tidak valid"),
  check("password", "password tidak boleh kosong")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("password min 6 karakter"),
];

exports.validationLogin = [
  check("usernameOrEmail", "username atau email tidak boleh kosong").notEmpty(),
  check("password", "password tidak boleh kosong").notEmpty(),
];
