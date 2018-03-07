const Joi = require('joi')

const params = Joi.object().keys({
  pathType: Joi.string().allow(['absolute', 'relative']).optional()
})

exports.previewMail = {
  params,
  body: Joi.object().keys({
    path: Joi.string().required(),
    model: Joi.object().required()
  })
}

exports.sendMail = {
  params,
  body: Joi.object().keys({
    path: Joi.string().required(),
    model: Joi.object().required(),
    subject: Joi.string().required(),
    email: Joi.string().email().required()
  })
}