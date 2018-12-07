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
  .usage('<URL>')
  .option('-b, --browser <browser>', 'Rendering browser. Choose \'chrome\' (default) or \'firefox\'.')
  .option('--viewports <viewports>', 'Viewports to take screenshots. e.g, `--viewports 1200,320`.')
  .option('--accept-language <language>', 'Accept language. The default is `en`. available with \'chrome\' browser option.')
  .option('--waitfor <seconds>', 'Number of seconds to wait for saving screenshots. The default is `3,000`.')
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

const saveScreenshot = async (url, viewport, selectedBrowser) => {
  const file = url.replace(/https?:\/\//, '').replace(/\/$/, '').replace(/\//g, '-')
  const puppeteer = browsers[selectedBrowser].puppeteer
  const isDefaultBrowser = browsers[selectedBrowser].isDefault
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  let path
  if (isDefaultBrowser) {
    // firefox-puppeteer@0.4.2 doesn't support `setExtraHTTPHeaders`
    await page.setExtraHTTPHeaders({
      'Accept-Language': lang
    })
    path = file + '-' + lang + '-' + viewport + '.png'
  } else {
    path = file + '-' + viewport + '-' + selectedBrowser + '.png'
  }
  await page.setViewport({width: parseInt(viewport), height: 800})
  await page.goto(url, {waitUntil: "domcontentloaded"}).then(() => {
    setTimeout(async () => {
      await page.screenshot({path: path, fullPage: true})
      await browser.close()
    }, waitfor)
  }).catch((e) => {
    console.error(e.message)
    process.exit(1)
  })
}

const url = program.args[0]
const selectedBrowser = (program.browser || 'chrome').toLowerCase()

if (!browsers[selectedBrowser]) {
  console.error('Detected invalid browser name: `' + selectedBrowser + '`.')
  program.outputHelp();
  process.exit(1)
}

for (let i = 0; i < viewports.length; i++) {
  const viewport = viewports[i]
  saveScreenshot(url, viewport, selectedBrowser)
}
