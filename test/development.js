const test = require('ava')
const { join } = require('path')

const { start, stop } = require('mono-test-utils')

let ctx

test.before('Start mono server (env: development)', async () => {
	// ctx = { server, app, conf, stdout, stderr }
	ctx = await start(join(__dirname, 'fixtures/ok/'), { env: 'development' })
})

test.after('Stop mono server', async () => {
	await stop(ctx.server)
})
