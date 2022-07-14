import puppeteer = require('puppeteer');
import { CourseInterface } from '../interfaces/course.interface';

export async function extractCourseraLinks(
  page: puppeteer.Page,
): Promise<CourseInterface[]> {
  const coursesFound = await page.$('.rc-NoResultsSearchPage');

  let registry = [];
  if (!coursesFound) {
    registry = await page.$$eval(
      'a[data-click-key="search.search.click.search_card"]',
      (options) =>
        options.map((option: HTMLAnchorElement) => {
          const img: HTMLImageElement = option.querySelector('img');
          const title: HTMLHeadingElement = option.querySelector('h2');

          const course: CourseInterface = {
            link: option.href,
            imagen: img.src,
            title: title.innerText,
          };
          return course;
        }),
    );
  }

  return registry;
}

export async function extractCourseraDetails(
  courseDetails: Array<CourseInterface>,
  browser: puppeteer.Browser,
) {
  const courses = [];
  while (courseDetails.length > 0) {
    const currentCourse: CourseInterface =
      courseDetails[courseDetails.length - 1];
    console.log('current URL:', currentCourse.link);

    const newPage = await browser.newPage();
    await newPage.goto(currentCourse.link);
    courseDetails.pop();

    try {
      currentCourse.price = null;
      currentCourse.description = await newPage.$eval(
        '.Skills',
        (el: HTMLAnchorElement) => el.innerText,
      );
    } catch (err) {
      console.error(
        `Ha ocurrido un error en la extraccion de los detalles en el enlace: ${currentCourse.link} error: ${err}`,
      );
    }

    courses.push(currentCourse);
    newPage.close();
  }
  return courses;
}
