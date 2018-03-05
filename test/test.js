const test = require('ava')
const { join } = require('path')

const { start, stop } = require('mono-test-utils')

const monoMail = require('../lib/index')

let ctx

test.before('Start mono server (env: test)', async () => {
	// ctx = { server, app, conf, stdout, stderr }
	ctx = await start(join(__dirname, 'fixtures/ok/'))
})

test('monoMail.generate should throw an error if no arguments provided', async (t) => {
	const error = await t.throws(monoMail.generate())

	t.true(error.message.includes('Mail argument must be provided'))
})

test('monoMail.generate should throw an error if no path provided', async (t) => {
	const error = await t.throws(monoMail.generate({}))

	t.true(error.message.includes('Path of the template mail must be provided'))
})

test('monoMail.generate should throw an error if no subject provided', async (t) => {
	const error = await t.throws(monoMail.generate({
		path: ''
	}))

	t.true(error.message.includes('Path of the template mail must be provided'))
})

test('monoMail.generate should throw an error if the file doesn\'t exist', async (t) => {
	const conf = {
		subject: 'Bad mail url',
		path: 'bad-url.html'
	}

	const error = await t.throws(monoMail.generate(conf))

	t.true(error.message.includes(`Unable to find template for mail, ${conf.path}`))
})

test('monoMail.generate with a bad style url should throw an error', async (t) => {
	const conf = {
		subject: 'Email test for {{ firstName }}',
		path: join(__dirname, 'fixtures/ok/email.html'),
		style: 'bad-style',
		model: {
			firstName: 'Jean',
			lastName: 'Clode'
		}
	}

	const error = await t.throws(monoMail.generate(conf))

	t.true(error.message.includes(`Unable to find style ${conf.style}`))
})



test('monoMail.generate should compile the template', async (t) => {
	const conf = {
		subject: 'Email test for {{ firstName }}',
		path: join(__dirname, 'fixtures/ok/email.html'),
		style: 'front',
		model: {
			firstName: 'Jean',
			lastName: 'Clode'
		}
	}

	const error = await t.throws(monoMail.generate(conf))

	t.true(error.message.includes(`Unable to find style ${conf.style}`))
})

test.after('Stop mono server', async () => {
	await stop(ctx.server)
})
