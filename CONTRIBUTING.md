# Contributing to y

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local environment
2. Install the dependencies with `npm install`
3. Write your changes into `lib/`
4. Add your tests into `test/`
5. Run `npm test` and make sure you have `100%` of coverage

Testing into your [Mono](https://github.com/terrajs/mono) project:

1. Run `npm link` to link the local repo to NPM.
2. Then run `npm link y` inside any Mono app
3. Follow the README to see how to use this module

## `lib/`

A [Mono](https://github.com/terrajs/mono) module can have multiple files inside `lib/`:

`index.js`

Should export a method (can be `async`) and receives as argument: `{ log, conf, server, app }`

`init.js`

File loaded when Mono init all files, same parameter as Mono init files. Should export a method (can be `async`) and receives as argument: `{ log, conf, server, app }`

`routes.js`

Same as Mono files so a module can add custom routes, see [example](https://github.com/terrajs/mono-notifications/blob/master/lib/routes.js)

`acl.js`

File loaded to define [Imperium](https://github.com/terrajs/imperium) roles/actions (same as Mono project files)

## `test/*.js`

Files where are written [AVA](https://github.com/avajs/ava) tests, it uses [mono-test-utils](https://github.com/terrajs/mono-test-utils) to make API tests easy.

Feel free to check [mono-mongodb tests](https://github.com/terrajs/mono-mongodb/tree/master/test) how tests can be made.

## `test/fixtures/`

This is where you can add files that won't be run by AVA, it's usully small Mono projects where you can test your module.

You can easily start your Mono project inside `fixtures/` by running:

```console
NODE_ENV=test npx mono dev test/fixtures/ok/
```

Where `test/fixtures/ok/` is a simple Mono project using the module.
