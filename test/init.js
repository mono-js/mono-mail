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

	t.is(ctx.conf.mono.mail.provider, 'smtp')

	await stop(ctx.server)
})
