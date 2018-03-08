const handlebars = require('handlebars')
const mjml2html = require('mjml')

const { cb } = require('@terrajs/mono').utils

const fs = require('fs')

let partials = {}

function argumentsForGeneration(conf) {
	if (!conf) throw Error('Mail argument must be provided')
	if (!conf.path) throw Error('Path of the template mail must be provided')
	if (!conf.subject) throw Error('Subject of mail must be provided')
}

module.exports = function ({ conf, log }) {
	const provider = require(`./providers/${conf.mono.mail.provider}.provider`)

	// Register handlebar partial
	async function registerPartial(partialName, partialPath) {
		let template

		try {
			template = await cb(fs.readFile, partialPath, 'utf8')
		} catch (e) {
			throw Error(`Unable to read file ${partialPath}, ${e}`)
		}

		partials[partialName] = handlebars.compile(template);
	}

	// Generate HTML mail file
	async function generate(mail) {
		// Validate mail arguments
		argumentsForGeneration(mail)

		let template
		let subjectTemplater

		try {
			template = fs.readFileSync(mail.path, 'utf8')
		} catch (e) {
			throw Error(`Unable to read file ${mail.path}, ${e}`)
		}

		try {
			subjectTemplater = handlebars.compile(mail.subject, { noEscape: true })
			mail.subject = subjectTemplater(mail.data)

			// Compile html with handlebars
			const bodyTemplater = handlebars.compile(template)

			// Generate final html with data and handlebar partials
			mail.body = bodyTemplater(mail.data, {
				partials
			})

			// Compile mjml template to html
			const bodyTemplaterMjml = mjml2html(mail.body)

			// Throw error if mjml2html return errors
			if (bodyTemplaterMjml.errors.length) throw Error(`Mjml compilation error : ${bodyTemplaterMjml.errors}`)

			mail.body = bodyTemplaterMjml.html

			return mail;
		} catch (e) {
			throw Error(`An error during the compilation has occured : ${e}`)
		}
	}

	// Send email with registered provider
	async function send(mail) {
		log.info(`Sending mail ${mail.name} in context ${mail.context}`)

		if (mail && !mail.to) throw Error('Email of recipient must be provided')
		const generatedMail = await generate(mail)
		await provider.send(generatedMail)
	}

	return {
		registerPartial,
		generate,
		send
	}
}
