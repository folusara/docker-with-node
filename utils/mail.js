const nodemailer = require("nodemailer");
const {pugEngine} = require('nodemailer-pug-engine')
const path = require('path')

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "747710a49f9f36",
      pass: "b71a1d6c31ba45"
    }
  });
transport.use("compile",pugEngine({
    templateDir:path.join(__dirname,'../template')
}))
module.exports = transport

