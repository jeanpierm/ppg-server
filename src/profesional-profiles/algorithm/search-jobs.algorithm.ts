import puppeteer = require('puppeteer');
import { waitLoad } from './helper';

const searchJobsUrl = 'https://www.linkedin.com/jobs';

// selectors
const jobTitleSelector =
  'input[aria-label="Search by title, skill, or company"]';
const locationSelector = 'input[aria-label="City, state, or zip code"]';
const submitSearchJobSelector = '.jobs-search-box__submit-button';

export async function searchJobs(
  page: puppeteer.Page,
  jobTitle: string,
  location: string,
) {
  console.debug('Init search jobs...');

  await page.goto(searchJobsUrl, waitLoad);
  await page.type(jobTitleSelector, jobTitle);
  await page.type(locationSelector, location);
  await page.click(submitSearchJobSelector);
  console.debug('Jobs searched successfully');
  await page.waitForNavigation(waitLoad);
}
