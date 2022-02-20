import puppeteer = require('puppeteer');
import { login } from './login.algorithm';
import { scrapJobLinks } from './scrap-job-links.algorithm';
import { scrapJobs as scrapJobs } from './scrap-jobs.algorithm';
import { searchJobs } from './search-jobs.algorithm';

const jobTitle = 'Backend Developer';
const location = 'Guayaquil, Guayas, Ecuador';

export async function generateProfesionalProfile() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await login(page);
  await searchJobs(page, jobTitle, location);
  const jobLinks = await scrapJobLinks(page);
  const { languages, frameworks } = await scrapJobs(page, jobLinks);

  console.log(languages, frameworks);

  await browser.close();
}
