import puppeteer from 'puppeteer'

export default class Launcher {
  static async build(viewport) {
    const launchOptions = {
      headless: false,
      slowMo: 0,
      args: [
        '--no-sandbox',
        '--disable-setui-sandbox',
        '--disable-web-security',
      ],
    }

    const browser = await puppeteer.launch(launchOptions)
    const page = await browser.newPage()
    const extendedPage = new Launcher(page)
    page.setDefaultTimeout(10000)

    switch (viewport) {
      case 'Mobile':
        const mobileViewport = puppeteer.devices['iPhone X']
        await page.emulate(mobileViewport)
        break
      case 'Tablet':
        const tabletViewport = puppeteer.devices['iPad landscape']
        await page.emulate(tabletViewport)
        break
      case 'Desktop':
        await page.setViewport({ width: 1024, height: 768 })
        break
      default:
        throw new Error('Supported devices are only MOBILE | TABLET | DESKTOP')
    }

    return new Proxy(extendedPage, {
      get: function (_target, property) {
        return extendedPage[property] || browser[property] || page[property]
      },
    })
  }

  constructor(page) {
    this.page = page
  }

  async waitAndClick(selector) {
    await this.page.waitForSelector(selector)
    await this.page.click(selector)
  }

  async waitAndType(selector, text) {
    await this.page.waitForSelector(selector)
    await this.page.type(selector, text)
  }

  async getText(selector) {
    await this.page.waitForSelector(selector)
    return this.page.$eval(selector, e => e.innerHTML)
  }

  async getCount(selector) {
    await this.page.waitForSelector(selector)
    return this.page.$$eval(selector, items => items.length)
  }

  async waitForText(selector, text) {
    await this.page.waitForSelector(selector)
    try {
      await this.page.waitForFunction(
        (selector, text) =>
          document
            .querySelector(selector)

            .innerText.replace(/\s/g, '')
            .toLowerCase()
            .includes(text.replace(/\s/g, '').toLowerCase()),
        {},
        selector,
        text
      )
    } catch (error) {
      if (error instanceof puppeteer.errors.TimeoutError) {
        throw new Error(`Text "${text}" not found for selector "${selector}"`)
      }
      throw new Error(error)
    }
  }

  async waitForXPathAndClick(xpath) {
    await this.page.waitForXPath(xpath)
    const elements = await this.page.$x(xpath)
    if (elements.length > 1) {
      // to see of there are a more than one xptahs
      console.warn('waitForXPathAndClick returned more than one result')
    }
    await elements[0].click() // clicks in the first xpath that finds
  }

  async isElementVisible(selector) {
    let visible = true
    await this.page
      .waitForSelector(selector, { visible: true, timeout: 3000 })
      .catch(() => {
        // we catch the error and later we can also use it in an assertion
        visible = false
      })
    return visible
  }

  async isXPathVisible(xpath) {
    let visible = true
    await this.page
      .waitForXPath(xpath, { visible: true, timeout: 3000 })
      .catch(() => {
        visible = false
      })
    return visible
  }

  async autoScrollToBottomOfPage() {
    await this.page.evaluate(async () => {
      await new Promise(resolve => {
        let totalHeight = 0
        const distance = 100
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight
          window.scrollBy(0, distance)
          totalHeight += distance
          if (totalHeight >= scrollHeight) {
            clearInterval(timer)
            resolve()
          }
        }, 200)
      })
    })
  }
}
