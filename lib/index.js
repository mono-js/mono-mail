module.exports = function ({ log, conf }) {
	// Default configuration
	const monoMailConf = conf.mono.mail || {}
	monoMailConf.provider = monoMailConf.provider || 'smtp-provider'
	// Update mono conf reference (used for init.js)
	conf.mono.mail = monoMailConf

	// var provider
	// Init the provider with the mono-mail configuration
	try {
		require(`./providers/${monoMailConf.provider}`)({ log, conf })
	} catch (e) {
		throw new Error(`No ${monoMailConf.provider} provider found in path ./providers/${monoMailConf.provider}.js`)
	}

	const Mails = require('./services')

	module.exports.generate = Mails.generate
}
