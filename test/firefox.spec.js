const chai = require('chai');
const assert = chai.assert;
const fs = require('fs');
const sizeOf = require('image-size');
const shootbot = require('../lib/Shootbot');

const errorHandler = handler = () => {}

const fileExists = (file) => {
  try {
    fs.statSync(file)
    return true;
  } catch(e) {
    if(e.code === 'ENOENT') return false
  }
}

describe('Take a screenshot with firefox.', () => {
  it('should exist screenshot with firefox', (done) => {
    shootbot.saveScreenshot('https://takayukimiyauchi.jp/', {
      engine: 'firefox',
      filename: 'firefox.png',
    }, (response) => {
      assert.deepEqual(true, fileExists('firefox.png'));
      const size = sizeOf('firefox.png')
      assert.deepEqual(1200, size.width);
      done()
    }, errorHandler)
  });

  it('should exist screenshot with firefox in ja', (done) => {
    shootbot.saveScreenshot('https://takayukimiyauchi.jp/', {
      engine: 'firefox',
      filename: 'firefox.png',
      lang: 'ja',
    }, handler, (message) => {
      assert.deepEqual('The browser doesn\'t support `--accept-language`. Please try another browser.', message)
      done()
    })
  });
});
