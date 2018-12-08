'use strict';

const puppeteerChrome = require('puppeteer');
const puppeteerFirefox = require('puppeteer-firefox');
const fs = require('fs');
const path = require('path');

const browsers = {
  chrome: puppeteerChrome,
  firefox: puppeteerFirefox,
}

const defaultOptions = {
  viewports: '1200,992,768,576',
  browser: 'chrome',
  acceptLanguage: 'en',
  waitfor: 3000,
}

exports.errorHandler = (message) => {
  console.error('\x1b[31mError:\x1b[0m %s', message);
  process.exit(1)
}

/* eslint no-unused-vars: 0 */
exports.handler = (response, options) => {
  // noting to do.
}

exports.fileExists = (file) => {
  try {
    fs.statSync(file)
    return true;
  } catch(e) {
    if(e.code === 'ENOENT') return false
  }
}

exports.loadOptions = (program) => {
  if (this.fileExists(path.join(process.env.HOME, '.shootbot.json'))) {
    try {
      const json = require(path.join(process.env.HOME, '.shootbot.json'))
      Object.assign(defaultOptions, json)
    } catch(e) {
      // Nothing to do.
    }
  }

  return {
    viewports: (program.viewports || defaultOptions.viewports).split(/,/),
    browser: (program.browser || defaultOptions.browser).toLowerCase(),
    lang: (program.acceptLanguage || defaultOptions.acceptLanguage),
    waitfor: (program.waitfor || defaultOptions.waitfor),
  }
}

exports.saveScreenshot = async (url, params = {}, handler, errorHandler) => {
  const options = {
    viewport: {
      width: 1200,
      height: 800,
    },
    engine: 'chrome',
    lang: 'en',
    fullpage: true,
    waitfor: 3000,
    filename: "screenshot.png"
  }

  Object.assign(options, params)

  if (!browsers[options.engine]) {
    errorHandler('Invalide browser.')
  }

  const puppeteer = browsers[options.engine]
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  if ('en' !== options.lang) {
    try {
      await page.setExtraHTTPHeaders({
        'Accept-Language': options.lang
      })
    } catch(e) {
      errorHandler('The browser doesn\'t support `--accept-language`. Please try another browser.')
    }
  }

  await page.setViewport({width: options.viewport.width, height: options.viewport.height})
  await page.goto(url, {waitUntil: "domcontentloaded"}).then((response) => {
    setTimeout(async (response, options) => {
      await page.screenshot({path: options.filename, fullPage: options.fullpage})
      await browser.close()
      handler(response, options);
    }, options.waitfor, response, options)
  }).catch((e) => {
    errorHandler(e.message)
  })
}
