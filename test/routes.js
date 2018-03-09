const test = require('ava')
const { join } = require('path')
const MailDev = require('maildev')

const { cb } = require('@terrajs/mono').utils
const { start, stop, $post } = require('mono-test-utils')

const defaultEmailConf = require('./fixtures/ok/conf/mail')
const mailModule = require('../lib/index')

let ctx
let maildev

test.before('Start mono, mailDev smtp server and register partials', async () => {
	const config = require(join(__dirname, 'fixtures/ok/conf', 'test'))
	// We create an smtp server localy
	maildev = new MailDev({
		smtp: config.smtp
	})

	// We listen for new mails
	maildev.listen()
	ctx = await start(join(__dirname, 'fixtures/ok/'), { env: 'test' })

	//Register header partial
	await mailModule.registerPartial('front-footer', join(__dirname, 'fixtures/ok/header.html'))
})

test('/mails/preview should set the path as relative by default', async (t) => {
	const { statusCode, body } = await $post('/mails/preview', {
		body: {
			path: 'url/test.html',
			data: defaultEmailConf.data
		}
	})

	t.true(body.code.includes(`Unable to read file ${join(__dirname, '..')}/url/test.html`))
	t.is(statusCode, 404)
})

test('/mails/preview should throw a 404 if relative path is wrong', async (t) => {
	const { statusCode } = await $post('/mails/preview', {
		qs: {
			pathType: 'relative'
		},
		body: {
			path: join('/', defaultEmailConf.path),
			data: defaultEmailConf.data
		}
	})

	t.is(statusCode, 404)
})

test('/mails/send should throw a 404 if subject is missing', async (t) => {
	const { statusCode } = await $post('/mails/send', {
		qs: {
			pathType: 'relative'
		},
		body: {
			subject: 'Hello, {{ firstName }}',
			to: 'test@terrajs.io',
			path: join('/', defaultEmailConf.path),
			data: defaultEmailConf.data
		}
	})

	t.is(statusCode, 404)
})

test(`/mails/preview should return HTML generated mail`, async (t) => {
	const generatedMail = await mailModule.generate(defaultEmailConf)

	// Preview email
	const { body } = await $post('/mails/preview', {
		qs: {
			pathType: 'absolute'
		},
		body: {
			path: join(defaultEmailConf.path),
			data: defaultEmailConf.data
		}
	})

	t.is(generatedMail.body, body)
})

test('/mails/send with smtp provider should send an email', async (t) => {
	const data = {
		firstName: 'World'
	}

	const body = {
		subject: 'Hello, {{ firstName }}',
		to: 'test@terrajs.io',
		path: join(defaultEmailConf.path),
		data: Object.assign(data, defaultEmailConf.data)
	}

	// Send email
	const { statusCode } = await $post('/mails/send', {
		qs: {
			pathType: 'absolute'
		},
		body
	})

	t.is(statusCode, 200)
	// Waiting for new email from smtp server
	const result = await t.throws((cb(maildev.on, 'new')))

	t.is(result.from.find((email) => email.address === ctx.conf.mono.mail.from).address, ctx.conf.mono.mail.from)
	t.is(result.to.find((email) => email.address === body.to).address, body.to)
	t.is(result.subject, `Hello, ${data.firstName}`)
	t.true(result.html.includes(defaultEmailConf.data.description))
})

test.after('Close mono instance', async () => {
	await stop(ctx.server)
})
