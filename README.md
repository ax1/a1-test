# a1-test

> test html files in one line

Testing web apps is a tedius task. Automate web tests can consume a lot of effort. This package saves precious time by allowing a really easy way to test a set of web pages.

The test will take a folder of html pages as input and it will run a headless chrome on them. If any console.error is captured on the page, the test is failed.

The test can also check external urls, use the depth parameter to browse around related pages.
For devs: use https://developers.google.com/web/updates/2017/04/headless-chrome as reference

To test all the html files in a local folder:

```javascript
const test = require('a1-test')
try {
  const folder = '/home/steven/myApp' // index.html, landing.html, details/index.html ...  
  await test.folder(folder) // also test.folder(folder, '/usr/lib/chromium-browser/chromium-browser')
  assert.ok(true,'tests passed')
} catch (e) {
  assert.fail(e.toString())
}
```
To test url and related pages, use the  `testHtmlUrl`. The test will look for related <a> tags, so use a depth parameter to limit the pages to test.
```javascript
const test = require('a1-test')
try {
  await test.url('http://google.com', '/usr/lib/chromium-browser/chromium-browser',1)
  assert.ok(true,'tests passed')
} catch (e) {
  assert.fail(e.toString())
}
```
For devs:

Fork the github project and customize by following these links:
- https://developers.google.com/web/updates/2017/04/headless-chrome
- https://chromedevtools.github.io/devtools-protocol/
