# a1-test

> test html files in one line

Testing web apps is a tedius task. Automate web tests can consume a lot of effort. This package saves precious time by allowing a really easy way to test a set of web pages.

The test will take a folder of html pages as input and it will run a headless chrome on them. If any console.error is captured on the page, the test is failed.

The test can also check external urls, use the depth parameter to browse around related pages.
For devs: use https://developers.google.com/web/updates/2017/04/headless-chrome as reference

```javascript

// check all the html pages in a local FOLDER
try {
  // folder containing the html pages
  const folder = '/home/steven/myApp'
  // normal usage
  await test.testHtmlFolder(folder)
  // for special cases, set the chrome executable path
  await  test.testHtmlFolder(folder, '/usr/lib/chromium-browser/chromium-browser')
  assert.ok(true,'tests passed')
} catch (e) {
  assert.fail(e.toString())
}

// check a valid URL (local or external)
try {
  await test.testHtmlUrl('http://google.com', '/usr/lib/chromium-browser/chromium-browser',1)
  assert.ok(true,'tests passed')
} catch (e) {
  assert.fail(e.toString())
}
```
