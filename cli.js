#!/usr/bin/env node

'use strict';

const program = require('commander');
const puppeteer = require('puppeteer');
const pkg = require('./package.json');

program
  .version(pkg.version)
  .usage('<URL>')
  .option('--viewports <viewports>', 'Viewports to take screenshots. e.g, `--viewports 1200,320`.')
.parse(process.argv);

let viewports = [
  1200,
  992,
  768,
  576
]

if (0 === program.args.length) {
  program.outputHelp();
  process.exit(1);
}

if (program.viewports && program.viewports.length) {
  viewports = program.viewports.split(/,/)
}

async function saveScreenshot(url, viewport) {
  const file = url.replace(/https?:\/\//, '').replace(/\/$/, '').replace(/\//g, '-')
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({width: parseInt(viewport), height: 800})
  await page.goto(url).then(() => {
    setTimeout(async () => {
      await page.screenshot({path: file + '-' + viewport + '.png', fullPage: true})
      await browser.close()
    }, 5000)
  }).catch((e) => {
    console.error(e.message)
    process.exit(1);
  })
}

const url = program.args[0]
for (let i = 0; i < viewports.length; i++) {
  const viewport = viewports[i]
  saveScreenshot(url, viewport)
}