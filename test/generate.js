const test = require('ava')
const { join } = require('path')

const { start, stop } = require('mono-test-utils')

const monoMail = require('../lib/index')
const defaultEmailConf = require('./fixtures/ok/conf/mail')

let ctx

test.before('Start mono server (env: test) with fixture ok', async () => {
	ctx = await start(join(__dirname, 'fixtures/ok/'))
})

test('monoMail.registerPartial should throw an error if file doesn\'t exist', async (t) => {
	const path = 'wrong-path.html'

	const error = await t.throws(monoMail.registerPartial('front-footer', path))

	t.true(error.message.includes(`Unable to read file ${path}`))
})

test('Partials registered by monoMail.registerPartial should be available during handlebar compilation', async (t) => {
	await monoMail.registerPartial('front-footer', join(__dirname, 'fixtures/ok/header.html'))

	const result = await monoMail.generate(defaultEmailConf)

	t.true(result.body.includes('Copyright © 2018 TerraJS, All rights reserved.'))
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
		path: 'file.html'
	}))

	t.true(error.message.includes('Subject of mail must be provided'))
})

test('monoMail.generate should throw an error if the file doesn\'t exist', async (t) => {
	const conf = {
		subject: 'Bad mail url',
		path: 'bad-url.html'
	}

	const error = await t.throws(monoMail.generate(conf))

	t.true(error.message.includes(`Unable to read file ${conf.path}`))
})

test('monoMail.generate should compile the template', async (t) => {
	const result = await monoMail.generate(defaultEmailConf)

	t.true(result.body.includes(defaultEmailConf.data.description))
})

test('monoMail.generate should throw an error if mjml error occured', async (t) => {
	const conf = {
		subject: 'Bad mail url',
		path: join(__dirname, 'fixtures/ko/bad-mjml.html')
	}

	const error = await t.throws(monoMail.generate(conf))

	t.true(error.message.includes('Mjml compilation error'))
})

test.after('Stop mono server', async () => {
	await stop(ctx.server)
})
