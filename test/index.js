const assert = require('assert')
const test = require('../lib/index')

  !async function() {
    try {
      const folder = '/home/ubuntu/SOFTWARE/IRIDIUMJS/x/test/html'
      await test.testWebApp(folder, '/usr/lib/chromium-browser/chromium-browser')
      assert.ok(true, `folder ${folder} is ok`)
    } catch (e) {
      console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee')
      assert.fail(e.toString())
    }
  }()
