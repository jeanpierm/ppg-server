import { Page } from 'puppeteer';
import { waitLoad } from './util';

export const jobDetailsSelector = '#job-details';

export async function extractJobDetail(
  page: Page,
  jobLink: string,
  jobIndex: number,
): Promise<string> {
  console.log(`Init extract job detail #${jobIndex + 1}...`);
  await page.goto(jobLink, waitLoad);
  await page.waitForSelector(jobDetailsSelector, { timeout: 5000 });
  const jobDetailRaw = await getRawJobDetail(page);
  const jobDetail = normalizeJobDetail(jobDetailRaw);
  console.log(`Job detail #${jobIndex + 1} extracted successfully`);
  console.log(`[Job ${jobIndex + 1}] detail: ${jobDetail}`);
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
