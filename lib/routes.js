const { conf, HttpError } = require('@terrajs/mono')
const { join } = require('path')

const routeName = conf.mono.mail.routeName

const mailModule = require('./index')
const validation = require('./routes.validation')

function getPath(req, body) {
	const type = req.query.pathType || 'relative'

	return (type === 'relative') ? join(__dirname, '../', body.path) : body.path
}

let routes = []

// Only expose routes if exposeRoutes set to true in mono mail conf
if (conf.mono.mail.exposeRoutes) {
	routes = [
		{
			method: 'post',
			validation: validation.previewMail,
			path: `/${routeName}/preview`,
			async handler(req, res) {
				let mail
				const body = req.body

				try {
					mail = await mailModule.generate({
						subject: 'Mono mail preview',
						data: body.data,
						path: getPath(req, body)
					})
				} catch (e) {
					throw new HttpError(e.message, 404)
				}

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

				try {
					await mailModule.send({
						subject: body.subject,
						data: body.data,
						to: body.to,
						path: getPath(req, body)
					})
				} catch (e) {
					throw new HttpError(e.message, 404)
				}

				res.json({})
			}
		}
	]
}

module.exports = routes
