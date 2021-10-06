const nodemailer = require("nodemailer");

exports.sendEmail = dataEmail => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "asepsodikin4543@gmail.com",
      pass: "Portalsepeda4543"
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  return transporter
    .sendMail(dataEmail)
    .then(info => console.log(`Email Terkirim: ${info.message}`))
    .catch(err => console.log(`Terjadi Kesalahan: ${err}`));
};
