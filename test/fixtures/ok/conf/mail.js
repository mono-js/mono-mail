const { join } = require('path')

module.exports = {
	subject: 'Hello, {{ firstName }}',
	path: join(__dirname, '../email.html'),
	data: {
		firstName: 'Hello world',
		title: 'Welcome to mono-mail',
		description: 'Mono mail is a mono module that using mjml and handlebar to generate and send awesome mails.'
	}
}
