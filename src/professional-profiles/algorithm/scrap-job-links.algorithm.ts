import puppeteer = require('puppeteer');

const jobElementSelector = '.job-card-container__link.job-card-list__title';
const jobListSelector = '.jobs-search-results__list.list-style-none';

/**
 * @param page
 * @returns Devuelve los enlaces de las ofertas de trabajo encontradas.
 */
export async function scrapJobLinks(page: puppeteer.Page): Promise<string[]> {
  console.debug('Init scrapping job links...');
  const links = await page.evaluate((elementSelector) => {
    const elements = document.querySelectorAll(elementSelector);
    return Array.from(elements).map((element: HTMLLinkElement) => element.href);
  }, jobElementSelector);
  console.debug(`Job links scrapped successfully (count: ${links.length})`);
  return links;
}
