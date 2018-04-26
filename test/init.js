const test = require('ava')
const { join } = require('path')

const { start, stop } = require('mono-test-utils')

/*
** Tests are run in serial
*/

test('start() should throw an error if bad provider conf defined', async (t) => {
	const error = await t.throws(start(join(__dirname, 'fixtures/ko/'), { env: 'bad-provider' }))

	t.true(error.message.includes(`No bad provider found in path ./providers/bad.provider.js`))
})

test('mono-mail should have specific default conf if not provided', async (t) => {
	const ctx = await start(join(__dirname, 'fixtures/ko/'), { env: 'empty-conf' })

	const monoMail = require('../lib/index')

	t.true(ctx.stdout.join().includes('[mono-mail:mono-mail] No provider found in conf, only the preview methods will be available'))

	t.is(ctx.conf.mono.mail.routeName, 'mails')
	t.is(ctx.conf.mono.mail.hasProvider, false)
	t.is(ctx.conf.mono.mail.exposeRoutes, false)
	t.falsy(monoMail.send)

	await stop(ctx.server)
})

test('mono-mail should have hasProvider and exposeRoutes to true if provider provided in conf', async (t) => {
	const ctx = await start(join(__dirname, 'fixtures/ok/'), { env: 'development' })

	t.is(ctx.conf.mono.mail.hasProvider, true)
	t.is(ctx.conf.mono.mail.exposeRoutes, true)

	await stop(ctx.server)
})
