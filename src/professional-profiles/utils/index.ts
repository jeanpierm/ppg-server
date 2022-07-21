import puppeteer = require('puppeteer');

/**
 * Espera hasta que cargue el contenido de la página web.
 */
export const waitLoad: puppeteer.WaitForOptions = { waitUntil: 'networkidle2' };

export const k = 10 ** 3;

export async function getTextContent(page: puppeteer.Page, selector: string) {
  const element = await page.$(selector);
  return element?.evaluate((el) => (el as HTMLElement).innerText.trim());
}

export async function getImageSrc(page: puppeteer.Page, selector: string) {
  const element = await page.$(selector);
  return element?.evaluate((el) => (el as HTMLImageElement).src);
}

/**
 * @param dict - diccionario (objeto) estructura clave (string): valor (número)
 */
export function getKeysSortedByHigherValue(
  dict: Record<string, number>,
): string[] {
  const technologiesOrdered = Object.keys(dict)
    // is different to zero
    .filter((technology) => dict[technology] !== 0)
    // order max to min
    .sort((a, b) => dict[b] - dict[a]);
  // slice only the first X technologies
  return technologiesOrdered;
}
