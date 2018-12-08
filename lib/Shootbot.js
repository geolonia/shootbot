'use strict';

const puppeteerChrome = require('puppeteer');
const puppeteerFirefox = require('puppeteer-firefox');

const browsers = {
  chrome: puppeteerChrome,
  firefox: puppeteerFirefox,
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
