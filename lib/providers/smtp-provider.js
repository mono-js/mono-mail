const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')

const { cb } = require('@terrajs/mono/utils')

module.exports = ({ log, conf }) => {
  log.info(`Create transport with smtp conf : ${conf.smtp}`)
  const transporter = nodemailer.createTransport(smtpTransport(conf.smtp))

  module.exports.send = async function (mail) {
    const configuration = {
      from: conf.from,
      to: mail.email,
      subject: mail.subject,
      html: mail.body,
      attachments: mail.attachments
    }

    if (mail.bbc) configuration.bbc = mail.bbc

    await cb(transporter.sendMail, configuration)
  }
}