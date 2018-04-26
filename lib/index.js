module.exports = function ({ conf, log }) {
	// Default configuration
	const monoMailConf = conf.mono.mail || {}

	monoMailConf.hasProvider = !!(monoMailConf.provider && monoMailConf.provider.name)

	if (!monoMailConf.hasProvider) log.info('No provider found in conf, only the preview methods will be available')

	monoMailConf.routeName = monoMailConf.routeName || 'mails'
	monoMailConf.exposeRoutes = monoMailConf.exposeRoutes || (conf.env === 'development') ? true : false

	// Update mono conf reference (used for init.js)
	conf.mono.mail = monoMailConf

	// Init the provider with the mono-mail configuration
	if (monoMailConf.hasProvider) {
		try {
			require(`./providers/${monoMailConf.provider.name}.provider`)({ log, conf: conf.mono.mail })
		} catch (e) {
			throw new Error(`No ${monoMailConf.provider.name} provider found in path ./providers/${monoMailConf.provider.name}.provider.js`)
		}
	}

	const { registerPartial, generate, send } = require('./services')({ conf, log })

	module.exports.registerPartial = registerPartial
	module.exports.generate = generate

	if (monoMailConf.hasProvider) module.exports.send = send
}
