# :rocket: zaflun/ngx-scripts

[![NPM version](https://img.shields.io/npm/v/@zaflun/ngx-scripts.svg)](https://www.npmjs.com/package/@zaflun/ngx-scripts)
[![Build Status](https://github.com/zaflun/ngx-scripts/workflows/build/badge.svg)](https://github.com/zaflun/ngx-scripts/actions)
![Node version](https://img.shields.io/node/v/@zaflun/ngx-scripts.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Installation

```bash
npm install --save @zaflun/ngx-scripts
```

```bash
yarn add @zaflun/ngx-scripts
```

## Usage

This modules provides CLI commands to be used in [NPM scripts](https://docs.npmjs.com/misc/scripts).

### Export environment variables to a JSON or JavaScript file

`ngx-scripts env <env_var> [<env_var2> ...] [--out <file>] [--format json|js] [--parse-json]`

Default output file is `src/environments/.env.ts` with JavaScript format.

#### Options
- `--parse-json`: During `env`, if an environment variable's value is parsable JSON, it will be a proper object in `.env.ts`

> Note: Yarn is automatically used instead of NPM is the environment variable `NGX_PACKAGE_MANAGER` is set to `yarn`.

# License

[MIT](LICENSE)
