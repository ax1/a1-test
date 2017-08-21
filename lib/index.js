const assert = require('assert')
const chromeLauncher = require('chrome-launcher')
const CDP = require('chrome-remote-interface')
const fs = require('fs')
const path = require('path')
const util = require('util')
const readdir = util.promisify(fs.readdir)

module.exports = { folder, url }

//chromePath: '/usr/lib/chromium-browser/chromium-browser'

async function folder(folderPath, chromePath) {
  try {
    const files = await readdir(folderPath)
    const htmlFiles = files.filter(file => file.endsWith('.html')).map(file => 'file://' + path.join(folderPath, file))
    testChrome(htmlFiles, chromePath)
  } catch (e) {
    throw e
  }
}

async function url(url, chromePath, depth) {
  try {
    testChrome([url], chromePath, depth)
  } catch (e) {
    throw e
  }
}

async function launchChrome(chromePath, flags) {
  const params = { port: 9222, chromeFlags: ['--window-size=412,732', '--disable-gpu', '--headless', ...flags] }
  if (chromePath) params.chromePath = '/usr/lib/chromium-browser/chromium-browser'
  return chromeLauncher.launch(params)
}

async function testChrome(urls, chromePath, depth) {
  let chrome
  try {
    let flags = []
    if (urls[0].startsWith("file:")) flags = ["--allow-file-access-from-files"]
    chrome = await launchChrome(chromePath, flags)
    const protocol = await CDP({ port: chrome.port })
    const { Page, Console, Runtime } = protocol

    try {
      await Promise.all([Console.enable(), Page.enable(), Runtime.enable()])
      await Console.clearMessages()
      //-----TEST CONSOLE ERRORS----------
      Console.messageAdded(params => {
        try {
          if (params.message.level === 'error') {
            console.log(params)
            assert.fail(params.message.text)
          }
        } catch (err) {
          console.error(err)
        }
      })

      //------IF DEPTH, LOOKUP HREF tags------
      Page.loadEventFired(async() => {
        try {
          if (depth && depth > 0) {
            const relatedUrls = await Runtime.evaluate({ expression: '[...document.querySelector("a")].map(e => e.href)' })
            const newDepth = depth - 1
            for (let u of relatedUrls) await testChrome(u, chromePath, newDepth)
          }
        } catch (err) {
          console.error(err)
        }
      })

      //------PROCESS FILE------
      for (let url of urls) {
        console.log(url)
        await Page.navigate({ url })
        await Page.loadEventFired()
      }
    } catch (err) {
      throw err
    }
  } catch (err) {
    throw err
  } finally {
    if (chrome) chrome.kill()
  }

}
