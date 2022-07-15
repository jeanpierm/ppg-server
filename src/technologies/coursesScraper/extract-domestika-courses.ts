import puppeteer = require('puppeteer');
import { CourseInterface } from '../interfaces/course.interface';

export async function extractDomestikaLinks(
  page: puppeteer.Page,
): Promise<CourseInterface[]> {
  const coursesFound = await page.$('.h1.search-form-stats__title');
  let registry = [];
  if (!coursesFound) {
    registry = await page.$$eval('li > a.row', (options) =>
      options.map((item: HTMLLinkElement) => {
        const img: HTMLImageElement = item.querySelector('img');
        const title: HTMLHeadingElement = item.querySelector('h3');

        const details: CourseInterface = {
          link: item.href,
          imagen: img.src,
          title: title.innerText,
        };
        return details;
      }),
    );
  }

  return registry;
}

export async function extractDkCourseDetails(
  courseDetails: Array<CourseInterface>,
  browser: puppeteer.Browser,
) {
  const domestikaCourses = [];
  while (courseDetails.length > 0) {
    const currentCourse: CourseInterface =
      courseDetails[courseDetails.length - 1];
    console.log('current URL:', currentCourse.link);

    const newPage = await browser.newPage();
    await newPage.goto(currentCourse.link);
    courseDetails.pop();

    try {
      currentCourse.price = await newPage.$eval(
        '.m-price.m-price--code',
        (el: HTMLSpanElement) => el.innerText,
      );
      currentCourse.description = await newPage.$eval(
        '.text-body-bigger-new',
        (el: HTMLAnchorElement) => el.innerText,
      );
    } catch (err) {
      console.error(
        `Ha ocurrido un error en la extraccion de los detalles en el enlace: ${currentCourse.link} error: ${err}`,
      );
    }

    domestikaCourses.push(currentCourse);
    newPage.close();
  }
  return domestikaCourses;
}
