module.exports = function ({ conf, log }) {
	// Default configuration
	const monoMailConf = conf.mono.mail || {}
	monoMailConf.provider = monoMailConf.provider || 'smtp'
	monoMailConf.routeName = monoMailConf.routeName || 'mails'
	monoMailConf.exposeRoutes = monoMailConf.exposeRoutes || (conf.env === 'development') ? true : false

	// Update mono conf reference (used for init.js)
	conf.mono.mail = monoMailConf

	// Init the provider with the mono-mail configuration
	try {
		require(`./providers/${monoMailConf.provider}.provider`)({ log, conf: conf.mono.mail })
	} catch (e) {
		throw new Error(`No ${monoMailConf.provider} provider found in path ./providers/${monoMailConf.provider}.provider.js`)
	}

	const { registerPartial, generate, send } = require('./services')({ conf, log })

	module.exports.registerPartial = registerPartial
	module.exports.generate = generate
	module.exports.send = send
}
