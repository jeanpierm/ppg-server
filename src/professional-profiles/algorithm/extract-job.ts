import { Browser } from 'puppeteer';
import { JobIntf } from '../interfaces/job.interface';
import { WorkPlace } from '../types/workplace.type';
import { getImageSrc, getTextContent, waitLoad } from './util';

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
  try {
    const page = await browser.newPage();
    await page.goto(url, waitLoad);
    page.setDefaultTimeout(10000);
    await page.waitForSelector(DETAILS_SELECTOR);

    const title = await getTextContent(page, TITLE_SELECTOR);
    const detail = await getTextContent(page, DETAILS_SELECTOR);
    const company = {
      name: await getTextContent(page, COMPANY_NAME_SELECTOR),
      photoUrl: await getImageSrc(page, COMPANY_PHOTO_SELECTOR),
    };
    const location = await getTextContent(page, LOCATION_SELECTOR);
    const workplaceType = await getTextContent(page, WORKPLACE_TYPE_SELECTOR);
    await page.close();

    const job: JobIntf = {
      title,
      detail,
      company,
      location,
      url,
      workplaceType: workplaceType as WorkPlace,
    };
    console.log(`[Job ${i + 1}] extracted successfully`);
    console.log(`[Job ${i + 1}]:`, job, '\n');

    return job;
  } catch (err) {
    console.error(err);
  }
}
