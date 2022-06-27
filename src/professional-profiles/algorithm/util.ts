import puppeteer = require('puppeteer');

/**
 * Espera hasta que cargue el contenido de la página web.
 */
export const waitLoad: puppeteer.WaitForOptions = { waitUntil: 'networkidle2' };

export const k = 10 ** 3;

export async function getTextContent(page: puppeteer.Page, selector: string) {
  const element = await page.$(selector);
  return element?.evaluate((el) => el.textContent.trim());
}

export async function getImageSrc(page: puppeteer.Page, selector: string) {
  const element = await page.$(selector);
  return element?.evaluate((el) => (el as HTMLImageElement).src);
}
