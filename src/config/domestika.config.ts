import { registerAs } from '@nestjs/config';

export interface DomestikaConfig {
  selectors: {
    noResults: string;
    results: string;
    course: {
      title: string;
      image: string;
      price: string;
      description: string;
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
  'domestika',
  (): DomestikaConfig => ({
    selectors: {
      noResults:
        process.env.DOMESTIKA_SELECTOR_NO_RESULTS ||
        '.h1.search-form-stats__title',
      results: process.env.DOMESTIKA_SELECTOR_RESULTS || 'li > a.row',
      course: {
        title: process.env.DOMESTIKA_SELECTOR_COURSE_TITLE || 'h3',
        image: process.env.DOMESTIKA_SELECTOR_COURSE_IMAGE || 'img',
        price:
          process.env.DOMESTIKA_SELECTOR_COURSE_PRICE ||
          '.m-price.m-price--code',
        description:
          process.env.DOMESTIKA_SELECTOR_COURSE_DESCRIPTION ||
          '.text-body-bigger-new',
      },
    },
    urls: {
      search:
        process.env.DOMESTIKA_URL_SEARCH || 'https://www.domestika.org/es',
    },
    queryParams: {
      search: process.env.DOMESTIKA_QUERY_PARAM_SEARCH || 'query',
    },
  }),
);
