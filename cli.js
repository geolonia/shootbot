#!/usr/bin/env node

'use strict';

const program = require('commander');
const puppeteer = require('puppeteer');
const pkg = require('./package.json');

program
  .version(pkg.version)
  .usage('<URL>')
  .option('--viewports <viewports>', 'Viewports to take screenshots. e.g, `--viewports 1200,320`.')
  .option('--accept-language <language>', 'Accept language. The default is `en`.')
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

const saveScreenshot = async (url, viewport) => {
  const file = url.replace(/https?:\/\//, '').replace(/\/$/, '').replace(/\//g, '-')
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setExtraHTTPHeaders({
    'Accept-Language': lang
  })
  await page.setViewport({width: parseInt(viewport), height: 800})
  await page.goto(url, {waitUntil: "domcontentloaded"}).then(() => {
    setTimeout(async () => {
      await page.screenshot({path: file + '-' + lang + '-' + viewport + '.png', fullPage: true})
      await browser.close()
    }, waitfor)
  }).catch((e) => {
    console.error(e.message)
    process.exit(1)
  })
}

const url = program.args[0]
for (let i = 0; i < viewports.length; i++) {
  const viewport = viewports[i]
  saveScreenshot(url, viewport)
}