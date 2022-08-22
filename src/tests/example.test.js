const { step } = require('mocha-steps');
const puppeteer = require('puppeteer');

describe('Mocha Steps Demo', () => {
  let browser;
  let page;
  before(async function () {
    browser = await puppeteer.launch({
      headless: true,
      slowMo: 0,
      devtools: false,
    });
    page = await browser.newPage();
    await page.setDefaultTimeout(7000);
    await page.setDefaultNavigationTimeout(7000);
  });
  after(async function () {
    await browser.close();
  });
  step('should load google homepage', async function () {
    await page.goto('https://google.com');
  });
  step('Step 2 should Fail', async function () {
    await page.waitForSelector('#FAIL');
  });
  step('Step 3', async function () {
    console.log('From Step 3');
  });
  step('Step 4', async function () {
    console.log('From Step 4');
  });
});
