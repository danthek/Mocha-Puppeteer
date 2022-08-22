import puppeteer from 'puppeteer';

export default class Builder {
  static async build(viewport) {
    const launchOptions = {
      headless: true,
      slowMo: 0,
      args: [
        '--no-sandbox',
        '--disable-setui-sandbox',
        '--disable-web-security',
      ],
    };
    const browser = await puppeteer.launch(launchOptions);
    const page = browser.newPage();
    const extendedPage = new Builder(page); // creates a proxy (combines browser, page and extenden page into one class because we want to extend it from our functions that dont come as default from puppeteer)
    await page.setDefaultTimeout(10000);
    await page.setDefaultNavigationTimeout(10000);
    switch (viewport) {
      case 'mobile':
        const mobileViewport = puppeteer.devices['iphoneX'];
        await page.emulate(mobileViewport);
        break;
      case 'tablet':
        const tabletViewport = puppeteer.devices['ipad'];
        await page.emulate(tabletViewport);
        break;
      case 'desktop':
        await page.viewport({ width: 800, height: 600 });
        break;

      default:
        throw new Error(
          `The selected ${viewport} viewport is not available, only mobile | tablet | desktop are supported`
        );
    }
  }
}
