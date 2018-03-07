const handlebars = require('handlebars')
const mjml2html = require('mjml')

const { cb } = require('@terrajs/mono/utils')

const fs = require('fs')

let definitions = {}
let partials = {}

function argumentsForGeneration(conf) {
	if (!conf) throw Error('Mail argument must be provided')
	if (!conf.path) throw Error('Path of the template mail must be provided')
	if (!conf.subject) throw Error('Subject of mail must be provided')
}

module.exports = function ({ conf, log }) {
	const provider = require(`./providers/${conf.mono.mail.provider}.provider`)
	// Register handlebar partial
	function registerPartial(def) {
		definitions[def.name] = def
	}

	// Generate HTML mail file
	async function generate(mail) {
		// Validate mail arguments
		argumentsForGeneration(mail)

		let pathRegex = mail.path.match(/(.+?)(\.[^.]*$|$)/)
		let template
		let subjectTemplater

		if (!pathRegex || pathRegex.length !== 3) throw Error(`Error during parsing path : ${mail.path}`)

		try {
			await cb(fs.access, pathRegex[1] + pathRegex[2], fs.F_OK)
		} catch (e) {
			throw Error(`Unable to find template for mail, ${mail.path}`)
		}

		try {
			template = await cb(fs.readFile, pathRegex[1] + pathRegex[2], 'utf8')
		} catch (e) {
			throw Error(`Unable to read file ${e}`)
		}

		try {
			subjectTemplater = handlebars.compile(mail.subject, { noEscape: true })
			mail.subject = subjectTemplater(mail.model)

			if (mail.partials) {
				Object.keys(mail.partials).forEach((partialName) => {
					handlebars.registerPartial(partialName, mail.partials[partialName])
				})
			}

			// Compile html with handlebars
			const bodyTemplater = handlebars.compile(template)

			// Generate final html with data and handlebar partials
			mail.body = bodyTemplater(mail.model, {
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
		log.info('Sending mail ${mail.name} in context ${mail.context}')

		const generatedMail = await generate(mail)
		if (!mail.email) throw Error('Email of recipient must be provided')
		await provider.send(generatedMail)
	}

	return {
		registerPartial,
		generate,
		send
	}
}
