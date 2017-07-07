const chromeLauncher = require('chrome-launcher')
const CDP = require('chrome-remote-interface')
const fs = require('fs')
const path = require('path')
const util = require('util')
const readdir = util.promisify(fs.readdir)

module.exports = { testWebApp }

//chromePath: '/usr/lib/chromium-browser/chromium-browser'

async function testWebApp(folderPath, chromePath) {
  try {
    const files = await readdir(folderPath)
    const htmlFiles = files.filter(file => file.endsWith('.html')).map(file => 'file://' + path.join(folderPath, file))
    testChrome(htmlFiles, chromePath)
  } catch (e) {
    console.error(e)
  }
}

async function launchChrome(chromePath) {
  const params = { port: 9222, chromeFlags: ['--window-size=412,732', '--disable-gpu', '--headless'] }
  if (chromePath) params.chromePath = '/usr/lib/chromium-browser/chromium-browser'
  return chromeLauncher.launch(params)
}

async function testChrome(urls, chromePath) {
  try {
    const chrome = await launchChrome(chromePath)
    const protocol = await CDP({ port: chrome.port })
    const { Page, Console } = protocol
    try {
      await Promise.all([Console.enable(), Page.enable()]);
      await Console.clearMessages();
      Console.messageAdded(params => {
        // console.log(params)
        if (params.message.level == 'error') {
          console.error(params)
          throw new Error(params)
        }
      })
      for (let url of urls) {
        console.log(url)
        await Page.navigate({ url });
        await Page.loadEventFired();
      }
    } catch (err) {
      throw err
    } finally {
      chrome.kill();
    }
  } catch (err) {
    throw err
  }

}

//testWebApp('/home/ubuntu/SOFTWARE/IRIDIUMJS/x/test/html', '/usr/lib/chromium-browser/chromium-browser')
