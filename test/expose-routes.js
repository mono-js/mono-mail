const test = require('ava')
const { join } = require('path')

const { start, stop, $get } = require('mono-test-utils')

const defaultEmailConf = require('./fixtures/ok/conf/mail')

const mailModule = require('../lib/index')

test('/mails/preview with development environment should return a 200', async (t) => {
	// Start mono
	const ctx = await start(join(__dirname, 'fixtures/ok/'), { env: 'development' })

	//Register header partial
	await mailModule.registerPartial('front-footer', join(__dirname, 'fixtures/ok/footer.html'))

	// Preview email
	const { statusCode } = await $get('/mails/preview', {
		qs: {
			pathType: 'absolute',
			path: join(defaultEmailConf.path),
			data: defaultEmailConf.data
		}
	})

	await stop(ctx.server)
	t.is(statusCode, 200)
})

test('/mails/preview with environment different of development should return a 404', async (t) => {
	// Invalidate require cache
	delete require.cache[require.resolve('../lib/routes')]
	// Start mono
	const ctx = await start(join(__dirname, 'fixtures/ok/'), { env: 'without-routes' })

	//Register header partial
	await mailModule.registerPartial('front-footer', join(__dirname, 'fixtures/ok/footer.html'))

	// Preview email
	const { statusCode } = await $get('/mails/preview', {
		qs: {
			pathType: 'absolute',
			path: join(defaultEmailConf.path),
			data: defaultEmailConf.data
		}
	})

	await stop(ctx.server)
	t.is(statusCode, 404)
})

test('/mails/preview with exposeRoutes set to true should return a 200', async (t) => {
	// Invalidate require cache
	delete require.cache[require.resolve('../lib/routes')]
	// Start mono
	const ctx = await start(join(__dirname, 'fixtures/ok/'), { env: 'with-routes' })

	//Register header partial
	await mailModule.registerPartial('front-footer', join(__dirname, 'fixtures/ok/footer.html'))

	// Preview email
	const { statusCode } = await $get('/mails/preview', {
		qs: {
			pathType: 'absolute',
			path: join(defaultEmailConf.path),
			data: defaultEmailConf.data
		}
	})

	await stop(ctx.server)
	t.is(statusCode, 200)
})
