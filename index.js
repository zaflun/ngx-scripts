const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const minimist = require('minimist');
const pkg = require('./package.json');

const appName = path.basename(process.argv[1]);
const help = `${chalk.bold('Usage')} ${appName} ${chalk.blue(
  '[command]'
)} [options]\n`;
const detailedHelp = `
${chalk.blue(
  'env'
)} <env_var> [<env_var2> ...] [--out <file>] [--format json|js] [--parse-json]
  Export environment variables to a JSON or JavaScript file.
  Default output file is ${chalk.cyan('src/environments/.env.ts')}
  
  --parse-json      If an environment variable's value is parsable JSON,
                    it generates an object for it in output file.`;

class NgxScriptsCli {
  constructor(args) {
    this._args = args;
    this._options = minimist(args, {
      boolean: ['help', 'parse-json'],
      string: ['out'],
      '--': true
    });
  }

  run() {
    if (this._options.help) {
      return this._help(true);
    }

    if (this._packageManager() === 'yarn') {
      this._options.yarn = true;
    }

    switch (this._args[0]) {
      case 'env':
        return this._env(
          this._options._.slice(1),
          this._options.out,
          this._options.format,
          this._options['parse-json']
        );
      default:
        this._help();
    }
  }

  _env(
    vars,
    outputFile = 'src/environments/.env.ts',
    format = 'js',
    parseJson = false
  ) {
    if (vars.length === 0) {
      this._exit(`${chalk.red('Missing arguments')}\n`);
    }

    let env = JSON.stringify(
      vars.reduce((env, v) => {
        env[v] = process.env[v] === undefined ? null : process.env[v];
        if (parseJson) {
          try {
            env[v] = JSON.parse(env[v]);
          } catch {}
        }

        return env;
      }, {}),
      null,
      2
    );

    if (format === 'js') {
      // Change to single quotes
      env = env.replace(/"([^"\\]*(?:\\.[^"\\]*)*)"/g, (match, v) => {
        const s = v.replace(/'/g, "\\'").replace(/\\"/g, '"');
        return `'${s}'`;
      });
      env = `export const env: { [s: string]: (${
        parseJson ? `any` : `string`
      } | null); } = ${env};\n`;
    }

    try {
      fs.writeFileSync(outputFile, env);
    } catch (error) {
      this._exit(
        `${chalk.red(
          `Error writing file: ${
            error && error.message ? error.message : error
          }`
        )}`
      );
    }
  }

  _packageManager() {
    return process.env.NGX_PACKAGE_MANAGER || 'npm';
  }

  _help(details) {
    console.log(pkg.version, 'APP SUPPORT SCRIPTS');
    this._exit(
      help +
        (details
          ? detailedHelp
          : `Use ${chalk.white('--help')} for more info.\n`)
    );
  }

  _exit(error, code = 1) {
    if (error) {
      console.error(error);
    }

    /* eslint unicorn/no-process-exit: "off" */
    process.exit(code);
  }
}

module.exports = NgxScriptsCli;
