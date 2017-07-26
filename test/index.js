const assert = require('assert')
const test = require('../lib/index')

  !async function() {
    try {
      // test local folder
      const folder = '/home/ubuntu/SOFTWARE/IRIDIUMJS/x/test/html'
      await test.folder(folder, '/usr/lib/chromium-browser/chromium-browser')
      assert.ok(true, `folder ${folder} is ok`)
      // test url
      const url = 'http://google.com'
      await test.url(url, '/usr/lib/chromium-browser/chromium-browser', 0)
      assert.ok(true, `url ${url} is ok`)
    } catch (e) {
      assert.fail(e.toString())
    }
  }()
