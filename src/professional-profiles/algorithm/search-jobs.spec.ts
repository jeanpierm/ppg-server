import { getEncodedSearchJobsUrl } from './search-jobs';

describe('getEncodedSearchJobsUrl', () => {
  test('should encode a URL with job title and location', () => {
    const jobTitle = 'Java Developer';
    const location = 'Guayaquil, Guayas, Ecuador';

    const url = getEncodedSearchJobsUrl(jobTitle, location);

    expect(url).toBe(
      'https://www.linkedin.com/jobs/search/?keywords=Java%20Developer&location=Guayaquil,%20Guayas,%20Ecuador',
    );
  });
});
