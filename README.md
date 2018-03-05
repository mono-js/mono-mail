# y

Mails module for Mono

[![npm version](https://img.shields.io/npm/v/y.svg)](https://www.npmjs.com/package/y)
[![Travis](https://img.shields.io/travis/gaetansenn/y/master.svg)](https://travis-ci.org/gaetansenn/y)
[![Coverage](https://img.shields.io/codecov/c/github/gaetansenn/y/master.svg)](https://codecov.io/gh/gaetansenn/y)
[![license](https://img.shields.io/github/license/gaetansenn/y.svg)](https://github.com/gaetansenn/y/blob/master/LICENSE)

## Installation

```bash
npm install --save y
```

Then, in your configuration file of your Mono application (example: `conf/application.js`):

```js
module.exports = {
  mono: {
    modules: ['y']
  }
}
```

## Configuration

`y` will use the `mono.y` property of your configuration (example: `conf/development.js`):

```js
module.exports = {
  mono: {
    y: {
      /* Module options */
    }
  }
}
```

## Usage

In your `src/` files of your Mono project, you can access `hello` like this:

```js
const { hello } = require('y')

hello()
```

## Development / Contribution

See the [contribution guidelines](CONTRIBUTING.md) of this project.

## License

MIT &copy; gaetansenn
