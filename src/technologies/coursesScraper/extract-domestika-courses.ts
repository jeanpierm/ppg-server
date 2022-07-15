import puppeteer = require('puppeteer');
import { waitLoad } from 'src/professional-profiles/algorithm/util';
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
  course: CourseInterface,
  browser: puppeteer.Browser,
) {
  console.log('current URL:', course.link);
  const newPage = await browser.newPage();
  await newPage.goto(course.link, waitLoad);
  newPage.setDefaultTimeout(10000);

  try {
    const price = await newPage.$eval(
      '.m-price.m-price--code',
      (el: HTMLSpanElement) => el.innerText,
    );
    const description = await newPage.$eval(
      '.text-body-bigger-new',
      (el: HTMLAnchorElement) => el.innerText,
    );

    const courseDetails: CourseInterface = {
      title: course.title,
      link: course.link,
      imagen: course.imagen,
      price: price,
      description: description,
    };
    return courseDetails;
  } catch (err) {
    console.error(
      `Ha ocurrido un error en la extraccion de los detalles en el enlace: ${course.link} error: ${err}`,
    );
  }
}
