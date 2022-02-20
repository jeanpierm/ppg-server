import puppeteer = require('puppeteer');

const jobCardContainerSelector =
  '.job-card-container__link.job-card-list__title';

export async function scrapJobLinks(page: puppeteer.Page) {
  console.debug('Init scrapping job links...');
  const links = await page.evaluate((selector) => {
    const elements = document.querySelectorAll(selector);
    return Array.from(elements).map((element: HTMLLinkElement) => element.href);
  }, jobCardContainerSelector);
  console.debug(`Job links scrapped successfully (${links.length})`);
  return links;
}
