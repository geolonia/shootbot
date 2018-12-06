#!/usr/local/env node

const program = require('commander');
const puppeteer = require('puppeteer');
const pkg = require('./package.json');

program
  .version(pkg.version)
  .usage('<URL>')
.parse(process.argv);

const viewports = [
  1200,
  992,
  768,
  576
]

async function saveScreenshot(url, viewport) {
  const file = url.replace(/https?:\/\//, '').replace(/\/$/, '').replace(/\//g, '-')
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url)
  await page.setViewport({width: viewport, height: 800})
  await setTimeout(async () => {
    await page.screenshot({path: file + '-' + viewport + '.png', fullPage: true})
    await browser.close()
  }, 5000)
}

const url = program.args[0]
for (let i = 0; i < viewports.length; i++) {
  const viewport = viewports[i]
  saveScreenshot(url, viewport)
}