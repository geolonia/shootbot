#!/usr/bin/env node

'use strict';

const program = require('commander');
const puppeteerChrome = require('puppeteer');
const puppeteerFirefox = require('puppeteer-firefox');
const pkg = require('./package.json');

const browsers = {
  chrome: { puppeteer: puppeteerChrome, isDefault: true },
  firefox: {puppeteer: puppeteerFirefox },
}

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

let viewports = [
  1200,
  992,
  768,
  576
]
if (program.viewports && program.viewports.length) {
  viewports = program.viewports.split(/,/)
}

let lang = 'en'
if (program.acceptLanguage && program.acceptLanguage) {
  lang = program.acceptLanguage
}

let waitfor = 3000
if (program.waitfor && program.waitfor) {
  waitfor = program.waitfor
}

const error = (message) => {
  console.error('\x1b[31mError:\x1b[0m %s', message);
  process.exit(1)
}

const saveScreenshot = async (url, viewport, selectedBrowser) => {
  const puppeteer = browsers[selectedBrowser].puppeteer
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  try {
    await page.setExtraHTTPHeaders({
      'Accept-Language': lang
    })
  } catch(e) {
    if (program.acceptLanguage && program.acceptLanguage) {
      error('The browser doesn\'t support `--accept-language`. Please try another browser.')
    }
  }

  await page.setViewport({width: parseInt(viewport), height: 800})
  await page.goto(url, {waitUntil: "domcontentloaded"}).then(() => {
    setTimeout(async () => {
      let filename = url.replace(/https?:\/\//, '').replace(/\/$/, '').replace(/\//g, '-') 
      filename = filename+ '-' + selectedBrowser + '-' + lang  + '-' + viewport + '.png'
      await page.screenshot({path: filename, fullPage: true})
      await browser.close()
    }, waitfor)
  }).catch((e) => {
    error(e.message)
  })
}

const url = program.args[0]
const selectedBrowser = (program.browser || 'chrome').toLowerCase()

if (!browsers[selectedBrowser]) {
  error('Invalid browser.')
}

for (let i = 0; i < viewports.length; i++) {
  const viewport = viewports[i]
  saveScreenshot(url, viewport, selectedBrowser)
}
