const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')

module.exports = ({ log, conf }) => {
	log.info(`Create transport with smtp conf : ${JSON.stringify(conf.provider)}`)
	const transporter = nodemailer.createTransport(smtpTransport(conf.provider))

	module.exports.send = function (mail) {
		const configuration = {
			from: conf.from,
			to: mail.to,
			subject: mail.subject,
			html: mail.body,
			attachments: mail.attachments
		}

		if (mail.bcc) configuration.bcc = mail.bcc

		return transporter.sendMail(configuration)
	}
}
