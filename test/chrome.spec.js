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

describe('Take a screenshot with chrome.', () => {
  it('should exist screenshot', (done) => {
    shootbot.saveScreenshot('https://takayukimiyauchi.jp/', {}, () => {
      assert.deepEqual(true, fileExists('screenshot.png'));
      const size = sizeOf('screenshot.png')
      assert.deepEqual(1200, size.width);
      done()
    }, errorHandler)
  });

  it('should exist ja in headers', (done) => {
    shootbot.saveScreenshot('https://takayukimiyauchi.jp/', {
      lang: 'ja'
    }, (response) => {
      assert.deepEqual(true, fileExists('screenshot.png'));
      assert.deepEqual('ja', response._request.headers()['accept-language']);
      done()
    }, errorHandler)
  });

  it('should be 320px', (done) => {
    shootbot.saveScreenshot('https://takayukimiyauchi.jp/', {
      viewport: {
        width: 320,
        height: 800,
      }
    }, () => {
      assert.deepEqual(true, fileExists('screenshot.png'));
      const size = sizeOf('screenshot.png')
      assert.deepEqual(320, size.width);
      done()
    }, errorHandler)
  });

  it('should be 640x480px', (done) => {
    shootbot.saveScreenshot('https://takayukimiyauchi.jp/', {
      viewport: {
        width: 640,
        height: 480,
      },
      fullpage: false,
    }, () => {
      assert.deepEqual(true, fileExists('screenshot.png'));
      const size = sizeOf('screenshot.png')
      assert.deepEqual(640, size.width);
      assert.deepEqual(480, size.height);
      done()
    }, errorHandler)
  });
});
