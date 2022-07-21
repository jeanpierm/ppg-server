import { registerAs } from '@nestjs/config';

export interface LinkedInConfig {
  account: Account;
  selectors: Selectors;
  urls: Urls;
}

interface Account {
  user: string;
  password: string;
}

interface Selectors {
  inputUsername: string;
  inputPassword: string;
  formLogin: string;
  job: {
    element: string;
    details: string;
    title: string;
    location: string;
    workplaceType: string;
    company: {
      name: string;
      photo: string;
    };
  };
}

interface Urls {
  login: string;
  searchJobs: string;
}

export default registerAs(
  'linkedin',
  (): LinkedInConfig => ({
    account: {
      user: process.env.LINKEDIN_USER,
      password: process.env.LINKEDIN_PASSWORD,
    },
    selectors: {
      inputUsername:
        process.env.LINKEDIN_SELECTOR_INPUT_USERNAME || '#username',
      inputPassword:
        process.env.LINKEDIN_SELECTOR_INPUT_PASSWORD || '#password',
      formLogin: process.env.LINKEDIN_SELECTOR_FORM_LOGIN || '.login__form',
      job: {
        element:
          process.env.LINKEDIN_SELECTOR_JOB_ELEMENT ||
          '.job-card-container__link.job-card-list__title',
        details: process.env.LINKEDIN_SELECTOR_JOB_DETAILS || '#job-details',
        title:
          process.env.LINKEDIN_SELECTOR_JOB_TITLE ||
          '.jobs-unified-top-card__job-title',
        location:
          process.env.LINKEDIN_SELECTOR_JOB_LOCATION ||
          '.jobs-unified-top-card__bullet',
        workplaceType:
          process.env.LINKEDIN_SELECTOR_JOB_WORKPLACE_TYPE ||
          '.jobs-unified-top-card__workplace-type',
        company: {
          name:
            process.env.LINKEDIN_SELECTOR_JOB_COMPANY_NAME ||
            '.jobs-unified-top-card__company-name',
          photo:
            process.env.LINKEDIN_SELECTOR_JOB_COMPANY_PHOTO ||
            '.EntityPhoto-square-3',
        },
      },
    },
    urls: {
      login: process.env.LINKEDIN_URL_LOGIN || 'https://www.linkedin.com/login',
      searchJobs:
        process.env.LINKEDIN_URL_SEARCH_JOBS ||
        'https://www.linkedin.com/jobs/search/',
    },
  }),
);
