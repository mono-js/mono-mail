module.exports = function ({ log, conf }) {
	// Default configuration
	const monoMailConf = conf.mono.mail || {}
	monoMailConf.provider = monoMailConf.provider || 'smtp'
	monoMailConf.routeName = monoMailConf.routeName || 'mails'

	// Update mono conf reference (used for init.js)
	conf.mono.mail = monoMailConf

	// Init the provider with the mono-mail configuration
	try {
		require(`./providers/${monoMailConf.provider}.provider`)({ log, conf: conf.mono.mail })
	} catch (e) {
		throw new Error(`No ${monoMailConf.provider} provider found in path ./providers/${monoMailConf.provider}.provider.js`)
	}

	const Mails = require('./services')({ conf, log })

	module.exports.generate = Mails.generate
	module.exports.send = Mails.send
}
