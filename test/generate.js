const test = require('ava')
const { join } = require('path')

const { start, stop } = require('mono-test-utils')

const monoMail = require('../lib/index')
const defaultEmailConf = {
  subject: 'Email test for {{ firstName }}',
  path: join(__dirname, 'fixtures/ok/email.html'),
  style: 'front',
  model: {
    title: 'Welcome to mono-mail',
    description: 'Mono module using mjml and handlebar to generate awesome template mail and send it to your customers'
  }
}

let ctx

test.before('Start mono server (env: test)', async () => {
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

test('monoMail.generate should compile the template', async (t) => {
  const result = await monoMail.generate(defaultEmailConf)

  t.true(result.body.includes(defaultEmailConf.model.description))
})

test.after('Stop mono server', async () => {
  await stop(ctx.server)
})
