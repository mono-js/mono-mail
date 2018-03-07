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
    mails: ['mono-mail']
  }
}
```

## Configuration

`mono-mail` will use the `mono.mail` property of your configuration (example: `conf/development.js`):

```js
module.exports = {
  mono: {
    mail: {
      /* Module options */
    }
  }
}
```

## Usage

In your `src/` files of your Mono project, you can access to mono-mail methods like this:

```js
const { send, generate, registerStyle } = require('mono-mail')
```

## Development / Contribution

See the [contribution guidelines](CONTRIBUTING.md) of this project.

## License

MIT &copy; gaetansenn
