const handlebars = require('handlebars')

const { cb } = require('@terrajs/mono/utils')
const { log, conf } = require('@terrajs/mono')

const juice = require('juice')
const fs = require('fs')

const provider = require(`./providers/${conf.mono.mail.provider}`)

let definitions = {}
let styles = {}
let partials = {}

function registerPartial(def) {
  definitions[def.name] = def
}

async function registerStyle(styleName, style) {
  let css = await cb(fs.readFile, style.cssPath, 'utf8')
  if (style.baseUrl) css = css.replace(/url\('\//g, "url('" + style.baseUrl + "/")

  style.css = css

  styles[styleName] = style
}

async function generate(mail) {
  if (!mail) throw Error('Mail argument must be provided')
  if (!mail.path) throw Error('Path of the template mail must be provided')
  if (!mail.subject) throw Error('Subject of mail must be provided')

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

    const bodyTemplater = handlebars.compile(template)
    mail.body = bodyTemplater(mail.model, {
      partials
    })

    let style = styles[mail.style]

    if (!style) throw Error(`Unable to find style ${mail.style}`)

    if (style.baseUrl) mail.body = mail.body.replace(/src="\//g, "src=\"" + style.baseUrl + "/").replace(/href="\//g, "href=\"" + style.baseUrl + "/");

    mail.body = juice.inlineContent(mail.body, style.css);

    return mail;
  } catch (e) {
    throw Error(`An error during the compilation has occured : ${e}`)
  }
}

async function send(mail) {
  log('Sending mail ${mail.name} in context ${mail.context}')

  const generatedMail = await generate(mail)
  try {
    await provider.send(generatedMail)
  } catch (e) {
    if (mail.important) throw new Error(e)

    log(e)
  }
}

module.exports = {
  registerStyle,
  registerPartial,
  generate,
  send
}