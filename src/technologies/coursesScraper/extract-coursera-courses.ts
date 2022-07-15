import puppeteer = require('puppeteer');
import { waitLoad } from 'src/professional-profiles/algorithm/util';
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
  course: CourseInterface,
  browser: puppeteer.Browser,
) {
  console.log('current URL:', course.link);
  const newPage = await browser.newPage();
  await newPage.goto(course.link, waitLoad);
  newPage.setDefaultTimeout(10000);

  try {
    const description = await newPage.$eval(
      '.Skills',
      (el: HTMLAnchorElement) => el.innerText,
    );

    const courseDetails: CourseInterface = {
      link: course.link,
      imagen: course.imagen,
      description: description,
      title: course.title,
      price: null,
    };
    return courseDetails;
  } catch (err) {
    console.error(
      `Ha ocurrido un error en la extraccion de los detalles en el enlace: ${course.link} error: ${err}`,
    );
  }
}
