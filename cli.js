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
  .option('-b, --browser [type]', 'specify a browser. Choose \'chrome\' [default] or \'firefox\'')
  .parse(process.argv);

const viewports = [
  1200,
  992,
  768,
  576
]

if (0 === program.args.length) {
  program.outputHelp();
  process.exit(1);
}

async function saveScreenshot(url, viewport, type) {
  const puppeteer = browsers[type].puppeteer
  const isDefault = browsers[type].isDefault
  const file = url.replace(/https?:\/\//, '').replace(/\/$/, '').replace(/\//g, '-')
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({width: viewport, height: 800})
  await page.goto(url)
  const filename = (isDefault ? [file, viewport] : [file, viewport, type]).join('-') + '.png'
  await setTimeout(async () => {
    await page.screenshot({path: filename, fullPage: true})
    await browser.close()
  }, 5000)
}

const url = program.args[0]
const type = (program.browser || 'chrome').toLowerCase()

if (!browsers[type]) {
  program.outputHelp();
  process.exit(2)
}

for (let i = 0; i < viewports.length; i++) {
  const viewport = viewports[i]
  saveScreenshot(url, viewport, type)
}
