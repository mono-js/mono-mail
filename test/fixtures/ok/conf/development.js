module.exports = {
	mono: {
		mail: {
			provider: {
				name: 'smtp',
				host: 'localhost',
				port: 1025,
				secure: false,
				tls: {
					rejectUnauthorized: false
				}
			},
			from: 'mono-mail@mono.io'
		}
	}
}
