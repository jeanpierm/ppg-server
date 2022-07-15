import { CourseInterface } from '../interfaces/course.interface';

export class CoursesResponse implements CourseInterface {
  readonly title: string;
  readonly link: string;
  readonly imagen: string;
  readonly price?: string;
  readonly description?: string;

  constructor(dto: CoursesResponse) {
    Object.assign(this, dto);
  }
}
