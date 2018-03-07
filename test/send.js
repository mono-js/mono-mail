const test = require('ava')
const { join } = require('path')
const MailDev = require('maildev')

const { cb } = require('@terrajs/mono').utils
const { start, stop } = require('mono-test-utils')

const monoMail = require('../lib/index')
const defaultEmailConf = {
  subject: 'Email test for {{ firstName }}',
  path: join(__dirname, 'fixtures/ok/email.html'),
  email: 'test@mail.com',
  style: 'front',
  model: {
    title: 'Welcome to mono-mail',
    description: 'Mono module using mjml and handlebar to generate awesome template mail and send it to your customers'
  }
}

let ctx

test('monoMails.send with smtp provider should send an email', async (t) => {
  const config = require(join(__dirname, 'fixtures/ok/conf', 'test'))
  // We create a smtp server localy
  const maildev = new MailDev({
    smtp: config.smtp
  })

  // We listen for new mails
  maildev.listen()
  ctx = await start(join(__dirname, 'fixtures/ok/'), { env: 'test' })
  // Send email
  monoMail.send(defaultEmailConf)
  // Waiting for new email from smtp server
  const result = await t.throws((cb(maildev.on, 'new')))

  t.true(result.html.includes(defaultEmailConf.model.description))
  await stop(ctx.server)
})