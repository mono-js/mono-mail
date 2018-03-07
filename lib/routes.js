const { conf } = require('@terrajs/mono')
const { join } = require('path')

const routeName = conf.mono.mail.routeName

const mailModule = require('./index')
const validation = require('./routes.validation')

module.exports = [
	{
		method: 'post',
		validation: validation.previewMail,
		path: `/${routeName}/preview`,
		async handler(req, res) {
			const body = req.body
			const type = req.params.pathType || 'relative'
			const path = (type === 'relative') ? join(__dirname, '../', body.path) : body.path

			const mail = await mailModule.generate({
				subject: 'Mono mail preview',
				model: body.model,
				path
			})

			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(mail.body, 'utf-8');
		}
	},
	{
		method: 'post',
		validation: validation.sendMail,
		path: `/${routeName}/send`,
		async handler(req, res) {
			const body = req.body
			const type = req.params.pathType || 'relative'
			const path = (type === 'relative') ? join(__dirname, '../', body.path) : body.path

			await mailModule.send({
				subject: body.subject,
				model: body.model,
				path
			})

			res.json({})
		}
	}
]
