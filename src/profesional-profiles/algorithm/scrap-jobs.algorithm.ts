import puppeteer = require('puppeteer');
import { countSkills } from './count-skills';
import { normalizeJobDetail, waitLoad } from './helper';
import { Languages } from '../enum/languages.enum';
import { FrameworksDictionary, LanguagesDictionary } from './types';
import { Frameworks } from '../enum/frameworks.enum';

const jobDetailsSelector = '#job-details';

export async function scrapJobs(page: puppeteer.Page, jobLinks: string[]) {
  console.debug('Init scrapping jobs...');

  const languages: LanguagesDictionary = {};
  const frameworks: FrameworksDictionary = {};

  for (const [index, link] of jobLinks.entries()) {
    console.debug(`Init scrapping job #${index + 1}...`);
    await page.goto(link, waitLoad);
    await page.waitForSelector(jobDetailsSelector);

    // get job detail
    const jobDetail = await page.evaluate((selector) => {
      const paragraph: HTMLParagraphElement = document.querySelector(selector);
      const title: HTMLHeadingElement = document.querySelector('h1');
      return `${title.innerText} ${paragraph.innerText}`;
    }, jobDetailsSelector);
    const jobDetailNormalized = normalizeJobDetail(jobDetail);

    // count skills (languages, frameworks, etc) of job detail
    countSkills(jobDetailNormalized, index, languages, frameworks);

    console.debug(`Job #${index + 1} scrapped successfully`);
  }
  console.debug('Jobs scrapped successfully');

  normalizeLanguages(languages);
  normalizeFrameworks(frameworks);

  return { languages, frameworks };
}

function normalizeLanguages(languages: LanguagesDictionary) {
  // normalize counts
  languages[Languages.NODEJS] += languages[Languages.NODEJS_ALT];
  delete languages[Languages.NODEJS_ALT];

  languages[Languages.HTML] += languages[Languages.HTML_ALT];
  delete languages[Languages.HTML_ALT];

  languages[Languages.CSS] += languages[Languages.CSS_ALT];
  delete languages[Languages.CSS_ALT];
}

function normalizeFrameworks(frameworks: FrameworksDictionary) {
  frameworks[Frameworks.EXPRESSJS] += frameworks[Frameworks.EXPRESSJS_ALT];
  delete frameworks[Frameworks.EXPRESSJS_ALT];

  frameworks[Frameworks.REACTJS] += frameworks[Frameworks.REACTJS_ALT];
  delete frameworks[Frameworks.REACTJS_ALT];

  frameworks[Frameworks.VUEJS] += frameworks[Frameworks.VUEJS_ALT];
  delete frameworks[Frameworks.VUEJS_ALT];

  frameworks[Frameworks.QUARKUS] +=
    frameworks[Frameworks.QUARKUS_ALT_1] + frameworks[Frameworks.QUARKUS_ALT_2];
  delete frameworks[Frameworks.QUARKUS_ALT_1];
  delete frameworks[Frameworks.QUARKUS_ALT_2];
}
