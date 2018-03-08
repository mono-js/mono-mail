const { join } = require('path')

module.exports = {
	subject: 'Hello, {{ firstName }}',
	path: join(__dirname, '../email.html'),
	data: {
		firstName: 'Hello world',
		title: 'Welcome to mono-mail',
		description: 'Mono module using mjml and handlebar to generate awesome template mail and send it to your customers'
	}
}
