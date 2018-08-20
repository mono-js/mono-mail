const test = require('ava')
const { join } = require('path')
const MailDev = require('maildev')

const { cb } = require('mono-utils')
const { start, stop } = require('mono-test-utils')
const defaultEmailConf = require('./fixtures/ok/conf/mail')

const monoMail = require('../lib/index')

let ctx

test('monoMail.generate should throw an error if the email doesn\'t exist', async (t) => {
	ctx = await start(join(__dirname, 'fixtures/ok/'), { env: 'test' })

	const conf = Object.assign({}, defaultEmailConf)
	delete conf.to

	const error = await t.throws(monoMail.send(conf))

	t.true(error.message.includes('Email of recipient must be provided'))
	await stop(ctx.server)
})

test('monoMail.send with smtp provider should send an email', async (t) => {
	await monoMail.registerPartial('front-footer', join(__dirname, 'fixtures/ok/footer.html'))

	const config = require(join(__dirname, 'fixtures/ok/conf', 'test'))
	// We create a smtp server localy
	const maildev = new MailDev({
		smtp: config.smtp
	})

	const sendConf = {
		to: 'test@terrajs.io',
		bcc: 'bbc@terrajs.io'
	}

	// We listen for new mails
	maildev.listen()
	ctx = await start(join(__dirname, 'fixtures/ok/'), { env: 'test' })
	// Send email
	monoMail.send(Object.assign(sendConf, defaultEmailConf))
	// Waiting for new email from smtp server
	const result = await t.throws((cb(maildev.on, 'new')))

	t.true(result.html.includes(defaultEmailConf.data.description))
	await stop(ctx.server)
})
