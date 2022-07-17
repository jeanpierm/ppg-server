import { Injectable } from '@nestjs/common';
import puppeteer = require('puppeteer');
import {
  extractCourseraLinks,
  extractCourseraDetails,
} from './extract-coursera-courses';
import {
  extractDkCourseDetails,
  extractDomestikaLinks,
} from './extract-domestika-courses';

const waitLoad: puppeteer.WaitForOptions = { waitUntil: 'networkidle2' };
const courseraURL = 'https://es.coursera.org/search';
const domestikaURL = 'https://www.domestika.org/es';

@Injectable()
export class CoursesScraper {
  async executeScraper(course: string) {
    try {
      let result = [];
      const browser = await puppeteer.launch({ headless: false });

      const domestikaPage = await browser.newPage();
      const url = new URL(domestikaURL);
      url.searchParams.set('query', course);
      await domestikaPage.goto(url.toString(), waitLoad);

      const links = await extractDomestikaLinks(domestikaPage);
      const domestikaCourses = (
        await Promise.all(
          links.map((link) => extractDkCourseDetails(link, browser)),
        )
      ).filter((course) => course != undefined);

      result = result.concat(domestikaCourses);
      domestikaPage.close();

      const courseraPage = await browser.newPage();
      const urlCoursera = new URL(courseraURL);
      urlCoursera.searchParams.set('query', course);
      await courseraPage.goto(urlCoursera.toString(), waitLoad);

      const linksC = await extractCourseraLinks(courseraPage);
      const courseraCourses = (
        await Promise.all(
          linksC.map((link) => extractCourseraDetails(link, browser)),
        )
      ).filter((course) => course != undefined);
      result = result.concat(courseraCourses);

      await courseraPage.close();

      await browser.close();
      return result;
    } catch (err) {
      console.error(
        `Ha ocurrido un error en el algoritmo de web scrapping a cursos. Error: ${err}`,
      );
    }
  }
}
