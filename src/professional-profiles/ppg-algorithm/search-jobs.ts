import puppeteer = require('puppeteer');
import { waitLoad } from './util';

const searchJobsUrl = 'https://www.linkedin.com/jobs/search/';

/**
 * Se dirige a la página de trabajos y busca ofertas.
 * @param page
 * @param jobTitle - título del trabajo a buscar
 * @param location - localidad del trabajo
 */
export async function searchJobs(page: puppeteer.Page, jobTitle: string, location: string) {
  console.debug('Init search jobs...');
  const jobsUrl = getEncodedSearchJobsUrl(jobTitle, location);
  await page.goto(jobsUrl, waitLoad);
  console.debug('Jobs searched successfully');
}

/**
 * @param jobTitle
 * @param location
 * @returns el URL de la búsqueda de trabajos según el jobTitle y location
 */
export function getEncodedSearchJobsUrl(jobTitle: string, location: string): string {
  return `${searchJobsUrl}?keywords=${encodeURI(jobTitle)}&location=${encodeURI(location)}`;
}
