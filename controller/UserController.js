require("dotenv").config();
const User = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../helpers");

exports.RegisterUser = async (req, res) => {
  const { username, email, password } = req.body;

  const validationUsername = await User.findOne({ username: username });
  const validationEmail = await User.findOne({ email: email });

  if (validationUsername) {
    return res.status(404).json({
      success: false,
      message: "username sudah terdaftar",
    });
  }

  if (validationEmail) {
    return res.status(404).json({
      success: false,
      message: "email sudah terdaftar",
    });
  }

  const hashPassword = await bcryptjs.hash(password, 10);
  const user = new User({
    username: username,
    email: email,
    password: hashPassword,
  });

  user.save();

  return res.status(201).json({
    success: true,
    message: "register success",
    data: user,
  });
};

exports.LoginUser = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
  if (user) {
    const login = await bcryptjs.compare(password, user.password);
    if (login) {
      const data = {
        id: user._id,
      };
      const token = await jwt.sign(data, process.env.JWT_SECRET);
      return res.status(200).json({
        success: true,
        message: "login success",
        token: token,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "password salah",
      });
    }
  } else {
    return res.status(404).json({
      success: false,
      message: "username atau email tidak terdaftar",
    });
  }
};

exports.getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.id });
  return res.status(200).json({
    success: true,
    message: "get user",
    data: user,
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({
    email: email,
  });
  if (!user) {
    return res.status(200).json({
      success: false,
      message: "email tidak terdaftar",
    });
  }
  const token = jwt.sign(
    {
      iduser: user._id,
    },
    process.env.JWT_SECRET
  );
  await user.updateOne({ resetPasswordLink: token });

  const templateEmail = {
    from: "Rafi",
    to: email,
    subject: "Link Reset Password",
    html: `<p>silahkan klik link dibawah untuk reset password anda</p><p>${process.env.CLIENT_URL}/resetpassword/${token}</p>`,
  };
  sendEmail(templateEmail);
  return res.status(200).json({
    status: true,
    message: "Link reset password berhasil terkirim",
  });
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const user = await User.findOne({ resetPasswordLink: token });

  if (user) {
    const hashPassword = await bcryptjs.hash(password, 10);
    user.password = hashPassword;
    await user.save();
    return res.status(201).json({
      success: true,
      message: "password berhasil di ubah",
    });
  }
};
