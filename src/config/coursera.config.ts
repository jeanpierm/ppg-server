import { registerAs } from '@nestjs/config';

export interface CourseraConfig {
  selectors: {
    noResults: string;
    results: string;
    course: {
      title: string;
      image: string;
      skills: string;
    };
  };
  urls: {
    search: string;
  };
  queryParams: {
    search: string;
  };
}

export default registerAs(
  'coursera',
  (): CourseraConfig => ({
    selectors: {
      noResults:
        process.env.COURSERA_SELECTOR_NO_RESULTS || '.rc-NoResultsSearchPage',
      results:
        process.env.COURSERA_SELECTOR_RESULTS ||
        'a[data-click-key="search.search.click.search_card"]',
      course: {
        title: process.env.COURSERA_SELECTOR_COURSE_TITLE || 'h2',
        image: process.env.COURSERA_SELECTOR_COURSE_IMAGE || 'img',
        skills: process.env.COURSERA_SELECTOR_COURSE_SKILLS || '.Skills',
      },
    },
    urls: {
      search:
        process.env.COURSERA_URL_SEARCH || 'https://es.coursera.org/search',
    },
    queryParams: {
      search: process.env.COURSERA_QUERY_PARAM_SEARCH || 'query',
    },
  }),
);
