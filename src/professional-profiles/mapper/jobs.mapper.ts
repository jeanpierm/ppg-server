import { JobResponse } from '../dto/job-response.dto';
import { Job } from '../schemas/job.schema';

export class JobsMapper {
  static toResponse({
    _id,
    title,
    company,
    location,
    url,
    workplaceType,
  }: Job): JobResponse {
    return {
      jobId: _id.toString(),
      title,
      company,
      location,
      url,
      workplaceType,
    };
  }
}
