import { Page } from 'puppeteer';
import { waitLoad } from './util';

export const jobDetailsSelector = '#job-details';

/**
 * Navega hasta el enlace del trabajo, espera a que se carguen los detalles del trabajo y luego extrae
 * los detalles del trabajo.
 * @param {Page} page - Página: el objeto de la página del scrapper
 * @param {string} jobLink - el enlace a la página de detalles del trabajo
 * @param {number} jobIndex - el índice del trabajo en la lista de trabajos
 * @returns Un string con el detalle del trabajo
 */
export async function extractJobDetail(
  page: Page,
  jobLink: string,
  jobIndex: number,
): Promise<string> {
  await page.goto(jobLink, waitLoad);
  await page.waitForSelector(jobDetailsSelector, { timeout: 5000 });
  const jobDetailRaw = await getRawJobDetail(page);
  const jobDetail = normalizeJobDetail(jobDetailRaw);
  console.log(`[Job ${jobIndex + 1}] detail extracted successfully`);
  console.log(`[Job ${jobIndex + 1}] detail:`, jobDetail, '\n');
  return jobDetail;
}

/**
 * @param page
 * @returns el título y la descripción de la oferta de trabajo actual.
 */
export async function getRawJobDetail(page: Page): Promise<string> {
  const jobDetail = await page.evaluate((selector) => {
    const paragraph: HTMLParagraphElement = document.querySelector(selector);
    const title: HTMLHeadingElement = document.querySelector('h1');
    return ` ${title.innerText} ${paragraph.innerText} `;
  }, jobDetailsSelector);
  return jobDetail;
}

/**
 * @param jobDetail
 * @returns una descripción de oferta de trabajo sin caracteres y espacios innecesarios o que puedan perjudicar la integridad del web scrapping.
 */
export function normalizeJobDetail(jobDetail: string): string {
  return jobDetail
    .toLowerCase()
    .replace(/[(),;:]/g, ' ')
    .replace(/\//g, ' ')
    .replace(/\s+/g, ' ');
}
