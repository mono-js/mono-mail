const Joi = require('joi')

const query = Joi.object().keys({
	pathType: Joi.string().allow(['absolute', 'relative']).optional()
})

exports.previewMail = {
	query: Joi.object().keys({
		path: Joi.string().required(),
		data: Joi.object().required()
	}).concat(query)
}

exports.sendMail = {
	query,
	body: Joi.object().keys({
		path: Joi.string().required(),
		data: Joi.object().required(),
		subject: Joi.string().required(),
		to: Joi.string().email().required()
	})
}
