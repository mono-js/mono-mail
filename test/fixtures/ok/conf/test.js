module.exports = {
	mono: {
		mail: {
			provider: 'smtp',
			from: 'mono-mail@mono.io',
			smtp: {
				host: 'localhost',
				port: 1025,
				secure: false,
				tls: {
					rejectUnauthorized: false
				}
			}
		}
	}
}
