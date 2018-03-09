<h1 align="center"><img src="https://user-images.githubusercontent.com/904724/37090727-b69ee98c-2205-11e8-8b25-0cbe40198d61.png" width="350" alt="Mono mail"/></h1>

> Emails module for [Mono](https://github.com/terrajs/mono)

[![npm version](https://img.shields.io/npm/v/mono-mail.svg)](https://www.npmjs.com/package/mono-mail)
[![Travis](https://img.shields.io/travis/terrajs/mono-mail/master.svg)](https://travis-ci.org/terrajs/mono-mail)
[![Coverage](https://img.shields.io/codecov/c/github/terrajs/mono-mail/master.svg)](https://codecov.io/gh/terrajs/mono-mail.js)
[![license](https://img.shields.io/github/license/terrajs/mono-mongodb.svg)](https://github.com/terrajs/mono-mail/blob/master/LICENSE)

## Installation

```bash
npm install --save mono-mail
```

Then, in your configuration file of your Mono application (example: `conf/application.js`):

```js
module.exports = {
  mono: {
    modules: ['mono-mail']
  }
}
```

## Configuration

`mono-mail` will use the `mono.mail` property of your configuration (example: `conf/development.js`):

```js
module.exports = {
  mono: {
    mail: {
      exposeRoutes: true, // enabled by default on development environment
      provider: 'smtp', //smtp by default (more to be added)
      from: 'mono-mail@mono.io', //sender email adress (required)
      smtp: // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/924fafffc09cfeb0267573af2c847cdbfcfa464d/types/nodemailer-smtp-transport/index.d.ts#L47
    }
  }
}
```

## Usage

Mono mail is a mono module that using [mjml](https://mjml.io/) and [handlebar](handlebarsjs.com) to generate and send awesome mails.

```js
const monoMail = require('mono-mail')
```

Mono mail also expose some methods as REST routes

TODO: All rest calls need a session and a role that contain `manageMail` action. This action is not added automatically.

## Routes

The routes for preview and sending an email are only available on development environment or if the `exposeRoutes` is set to true in the configuration of the module.

### Test preview route

Run the mono server with mono-mail
```
NODE_ENV=test npx mono dev test/fixture/ok
```
Once the server launched go to this [url](http://localhost:8000/mails/preview?data[title]=Welcome%20to%20mono-mail&data[description]=Mono%20mail%20is%20a%20mono%20module%20that%20using%20mjml%20and%20handlebar%20to%20generate%20and%20send%20awesome%20mails.&path=test/fixtures/ok/email-preview.html)



| Method | URI | Query params | Body | Action   |
| :------| :---| :------------| :-----| :--------|
| `GET`  | /mails/preview |  `path`, `data`, `pathType` | | Return HTML Generated mail |
| `POST`  | /mails/send   | `pathType` | `path`, `data`, `to`, `subject` | Send email |

Query params:
- `pathType`?: String (`relative` or `absolute`) Relative from current mono instance __dirname__

Post/Query params:
- `path`: String. Path to the mail file
- `data`: Object. Data object that will be compiled by handlebar

Post params:
- `subject`: String (compiled with handlebar). Subject of the mail
- `to`: String. Email adress of the sender

### registerPartial

```js
registerPartial(partialName = String, partialPathmail = String): Promise<void>
```

Register new partial template to be used inside mail template

Arguments:
- `partialName`: String. Partial name key
- `partialPathmail`: String. Path of the partial template

```js
// Register new partial
const template = await monoMail.registerPartial('font-footer', join(__dirname, 'modules/mails/font-footer.html'))
```

### generate

```js
generate(mail = { path, data, subject }): Promise<String>
```

Generate HTML template from mail object.

Arguments:
- `path`: String. Path to the mail file
- `data`: Object. Data object that will be compiled by handlebar
- `subject`: String (compiled with handlebar). Subject of the mail

```js
// Generate template mail in HTML
const template = await monoMail.generate({
  subject: 'Hello, {{ firstName }}',
  path: join(__dirname, 'modules/users/signup.html'),
  data: {
    title: 'Welcome to mono-mail',
    description: 'Mono module using mjml and handlebar to generate awesome template mail and send it to your customers'
  }
})
```

### send

```js
send(mail = { path, data, subject, bcc, email }): Promise<void>
```

Generate HTML template from mail object.

Arguments:
- `bcc`: String. Blind Carbon Copy email
- `email`: String. Recipient email address


```js
// Send email to recipient@terrajs.io recipient
const template = await monoMail.generate({
  subject: 'Hello, {{ firstName }}',
  path: join(__dirname, 'modules/users/signup.html'),
  bcc: 'copy@terrajs.io',
  to: 'recipient@terrajs.io',
  data: {
    title: 'Welcome to mono-mail',
    description: 'Mono module using mjml and handlebar to generate awesome template mail and send it to your customers'
  }
})
```

## Development / Contribution

See the [contribution guidelines](CONTRIBUTING.md) of this project.

## License

MIT &copy; gaetansenn
