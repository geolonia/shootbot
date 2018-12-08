#!/usr/bin/env node

'use strict';

const program = require('commander');
const shootbot = require('./lib/Shootbot')
const pkg = require('./package.json');

program
  .version(pkg.version)
  .usage('[options] <URL>')
  .option('-b, --browser <browser>', '`chrome` or `firefox`. The default is `chrome`')
  .option('-v, --viewports <viewports>', 'Viewports to take screenshots. e.g, `--viewports 1200,320`.')
  .option('-l, --accept-language <language>', 'The language. The default is `en`.')
  .option('-w, --waitfor <seconds>', 'The number of seconds to wait for saving screenshots. The default is `3,000`.')
  .parse(process.argv);

if (0 === program.args.length) {
  program.outputHelp();
  process.exit(1);
}

const url = program.args[0]

const viewports = (program.viewports || '1200,992,768,576').split(/,/)
const browser = (program.browser || 'chrome').toLowerCase()
const lang = (program.acceptLanguage || 'en')
const waitfor = (program.waitfor || 3000)

const errorHandler = (message) => {
  console.error('\x1b[31mError:\x1b[0m %s', message);
  process.exit(1)
}

/* eslint no-unused-vars: 0 */
const handler = (response) => {
  // noting to do.
}

for (let i = 0; i < viewports.length; i++) {
  const prefix = url.replace(/https?:\/\//, '').replace(/\/$/, '').replace(/\//g, '-')
  const filename = `${prefix}-${browser}-${lang}-${viewports[i]}.png`

  shootbot.saveScreenshot(url, {
    viewport: {
      width: parseInt(viewports[i]),
      height: 800,
    },
    engine: browser,
    lang: lang,
    waitfor: waitfor,
    filename: filename
  }, handler, errorHandler)
}