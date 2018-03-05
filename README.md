# Mono Mail

Mails module for Mono

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
