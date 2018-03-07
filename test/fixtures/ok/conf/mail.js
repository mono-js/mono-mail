const { join } = require('path')

module.exports = {
  subject: 'Email test for {{ firstName }}',
  path: join(__dirname, '../email.html'),
  style: 'front',
  model: {
    title: 'Welcome to mono-mail',
    description: 'Mono module using mjml and handlebar to generate awesome template mail and send it to your customers'
  }
}