const { conf, HttpError } = require('@terrajs/mono')
const { join } = require('path')

const routeName = conf.mono.mail.routeName

const mailModule = require('./index')
const validation = require('./routes.validation')

function getPath(req, path) {
	const type = req.query.pathType || 'relative'

	return (type === 'relative') ? join(__dirname, '../', path) : path
}

let routes = []

// Only expose routes if exposeRoutes set to true in mono mail conf
if (conf.mono.mail.exposeRoutes) {
	routes = [
		{
			method: 'get',
			validation: validation.previewMail,
			path: `/${routeName}/preview`,
			async handler(req, res) {
				let mail
				const query = req.query

				try {
					mail = await mailModule.generate({
						subject: 'Mono mail preview',
						data: query.data,
						path: getPath(req, query.path)
					})
				} catch (e) {
					throw new HttpError(e.message, 404)
				}

				res.writeHead(200, { 'Content-Type': 'text/html' });
				res.end(mail.body, 'utf-8');
			}
		}
	]

	// Only expose routes sendMail if provider is provided in mono mail conf
	if (conf.mono.mail.hasProvider) {
		routes.push({
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
						path: getPath(req, body.path)
					})
				} catch (e) {
					throw new HttpError(e.message, 404)
				}

				res.json({})
			}
		})
	}
}

module.exports = routes
