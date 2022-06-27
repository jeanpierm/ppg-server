import { Browser, Page } from 'puppeteer';
import { Company } from '../dto/company.dto';
import { JobIntf } from '../interfaces/job.interface';
import { WorkPlace } from '../types/workplace.type';
import { waitLoad } from './util';

export const DETAILS_SELECTOR = '#job-details';
export const TITLE_SELECTOR = '.jobs-unified-top-card__job-title';
export const COMPANY_NAME_SELECTOR = '.jobs-unified-top-card__company-name';
export const COMPANY_PHOTO_SELECTOR = '.EntityPhoto-square-3';
export const LOCATION_SELECTOR = '.jobs-unified-top-card__bullet';
export const WORKPLACE_TYPE_SELECTOR = '.jobs-unified-top-card__workplace-type';

/**
 * Abre una nueva pestaña y navega hacia el enlace de la oferta de trabajo, espera a que se carguen los detalles del trabajo y luego extrae
 * los detalles del trabajo.
 * @param {Browser} browser - Browser: el navegador del web scrapper
 * @param {string} url - el enlace a la página de detalles del trabajo
 * @param {number} i - el índice del trabajo en la lista de trabajos
 * @returns Un string con el detalle del trabajo
 */
export async function extractJobMetadata(
  browser: Browser,
  url: string,
  i: number,
): Promise<JobIntf> {
  let workplaceType: WorkPlace;
  const page = await browser.newPage();
  await page.goto(url, waitLoad);
  page.setDefaultTimeout(5000);

  // const detailsEl = await page.waitForSelector(DETAILS_SELECTOR);
  // const s = detailsEl?.evaluate((el) => el.textContent);
  try {
    await page.waitForSelector(WORKPLACE_TYPE_SELECTOR, { timeout: 5000 });
    workplaceType = await extractWorkplaceType(page);
  } catch (err) {
    console.error(err);
  }
  const title = await extractTitle(page);
  const detailRaw = await extractRawJobDetail(page);
  const detail = normalizeJobDetail(detailRaw);
  const company = await extractCompany(page);
  const location = await extractLocation(page);
  await page.close();

  const job: JobIntf = {
    title,
    detail,
    company,
    location,
    url,
    workplaceType,
  };
  console.log(`[Job ${i + 1}] extracted successfully`);
  console.log(`[Job ${i + 1}]:`, job, '\n');

  return job;
}

export async function extractWorkplaceType(page: Page): Promise<WorkPlace> {
  const workplaceType = await page.evaluate((selector): string => {
    const workplaceSpan: HTMLSpanElement = document.querySelector(selector);
    return workplaceSpan.innerText.trim();
  }, WORKPLACE_TYPE_SELECTOR);

  return workplaceType as WorkPlace;
}

export async function extractTitle(page: Page): Promise<string> {
  const title = await page.evaluate((selector): string => {
    const titleHeading: HTMLHeadingElement = document.querySelector(selector);
    return titleHeading.innerText.trim();
  }, TITLE_SELECTOR);

  return title;
}

export async function extractLocation(page: Page): Promise<string> {
  const location = await page.evaluate((selector): string => {
    const locationSpan: HTMLSpanElement = document.querySelector(selector);
    return locationSpan.innerText.trim();
  }, LOCATION_SELECTOR);

  return location;
}

export async function extractCompany(page: Page): Promise<Company> {
  const company = await page.evaluate(
    (namesSelector, photoSelector): Company => {
      const nameSpan: HTMLSpanElement = document.querySelector(namesSelector);
      const photoImg: HTMLImageElement = document.querySelector(photoSelector);
      return { name: nameSpan.innerText.trim(), photoUrl: photoImg.src };
    },
    COMPANY_NAME_SELECTOR,
    COMPANY_PHOTO_SELECTOR,
  );

  return company;
}

/**
 * @param page
 * @returns los detalles de la oferta de trabajo.
 */
export async function extractRawJobDetail(page: Page): Promise<string> {
  const jobDetail = await page.evaluate(
    (detailsSelector, titleSelector) => {
      const detailsPara: HTMLParagraphElement =
        document.querySelector(detailsSelector);
      const titleHeading: HTMLHeadingElement =
        document.querySelector(titleSelector);
      return ` ${titleHeading.innerText} ${detailsPara.innerText} `;
    },
    DETAILS_SELECTOR,
    TITLE_SELECTOR,
  );
  return jobDetail;
}

/**
 * @param jobDetail
 * @returns elimina caracteres y espacios innecesarios o que puedan perjudicar la integridad del web scrapping.
 */
export function normalizeJobDetail(jobDetail: string): string {
  return jobDetail
    .toLowerCase()
    .replace(/[(),;:]/g, ' ')
    .replace(/\//g, ' ')
    .replace(/\s+/g, ' ');
}
