import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import puppeteer = require('puppeteer');
import { CourseraConfig } from '../../config/coursera.config';
import { DomestikaConfig } from '../../config/domestika.config';
import { PuppeteerConfig } from '../../config/puppeteer.config';
import { CourseInterface } from '../../technologies/interfaces/course.interface';

const waitLoad: puppeteer.WaitForOptions = { waitUntil: 'networkidle2' };

@Injectable()
export class CoursesScraperService {
  private readonly logger = new Logger(CoursesScraperService.name);
  private readonly puppeteerConfig =
    this.configService.get<PuppeteerConfig>('puppeteer');
  private readonly courConfig =
    this.configService.get<CourseraConfig>('coursera');
  private readonly courSelectors = this.courConfig.selectors;
  private readonly courUrls = this.courConfig.urls;
  private readonly courParams = this.courConfig.queryParams;
  private readonly dkConfig =
    this.configService.get<DomestikaConfig>('domestika');
  private readonly dkSelectors = this.dkConfig.selectors;
  private readonly dkUrls = this.dkConfig.urls;
  private readonly dkParams = this.dkConfig.queryParams;

  constructor(private readonly configService: ConfigService) {}

  async getCourses(searchCriteria: string): Promise<CourseInterface[]> {
    const browser = await puppeteer.launch(this.puppeteerConfig.options);
    try {
      this.logger.log('Iniciando obtención de cursos por web scraping...');
      let result: CourseInterface[] = [];
      const domestikaCourses = await this.extractDomestikaCourses(
        browser,
        searchCriteria,
      );
      this.logger.log(
        `Cursos de DOMESTIKA obtenidos (${domestikaCourses.length})`,
      );
      const courseraCourses = await this.extractCourseraCourses(
        browser,
        searchCriteria,
      );
      this.logger.log(
        `Cursos de COURSERA obtenidos (${courseraCourses.length})`,
      );
      await browser.close();
      result = result.concat(domestikaCourses, courseraCourses);
      this.logger.log(
        `Total de cursos obtenidos para "${searchCriteria}": ${result.length}`,
      );
      return result;
    } catch (err) {
      await browser.close();
      console.error(
        `Ha ocurrido un error en el algoritmo de web scrapping para cursos.`,
        err,
      );
      throw new InternalServerErrorException(
        `Ha ocurrido un error en el algoritmo de web scrapping para cursos.`,
        err.message,
      );
    }
  }

  private async extractDomestikaCourses(
    browser: puppeteer.Browser,
    searchCriteria: string,
  ) {
    const page = await browser.newPage();
    const url = new URL(this.dkUrls.search);
    url.searchParams.set(this.dkParams.search, searchCriteria);
    await page.goto(url.toString(), waitLoad);

    const results = await this.extractDomestikaResults(page);
    const courses: CourseInterface[] = (
      await Promise.all(
        results.map((link) =>
          this.extractDomestikaCourseDetails(link, browser),
        ),
      )
    ).filter((course) => course != undefined);
    await page.close();

    return courses;
  }

  private async extractDomestikaResults(
    page: puppeteer.Page,
  ): Promise<CourseInterface[]> {
    const noResults = await page.$(this.dkSelectors.noResults);
    if (noResults) return [];

    const imgSelector = this.dkSelectors.course.image;
    const titleSelector = this.dkSelectors.course.title;
    const results = await page.$$eval(
      this.dkSelectors.results,
      (options, imgSelector, titleSelector, maxCourses) => {
        if (options?.length > maxCourses)
          options = options.slice(0, maxCourses);

        return options.map((item: HTMLLinkElement) => {
          const img: HTMLImageElement = item.querySelector(
            imgSelector as string,
          ) as HTMLImageElement;
          const title: HTMLHeadingElement = item.querySelector(
            titleSelector as string,
          ) as HTMLHeadingElement;

          const details: CourseInterface = {
            link: item.href,
            imagen: img.src,
            title: title.innerText,
          };
          return details;
        });
      },
      imgSelector,
      titleSelector,
      this.dkConfig.maxCoursesToScrap,
    );

    return results as CourseInterface[];
  }

  private async extractDomestikaCourseDetails(
    course: CourseInterface,
    browser: puppeteer.Browser,
  ) {
    console.log('current URL:', course.link);
    const newPage = await browser.newPage();
    await newPage.goto(course.link, waitLoad);
    newPage.setDefaultTimeout(this.puppeteerConfig.timeout);

    try {
      const price = await newPage.$eval(
        this.dkConfig.selectors.course.price,
        (el: HTMLSpanElement) => el.innerText,
      );
      const description = await newPage.$eval(
        this.dkConfig.selectors.course.description,
        (el: HTMLAnchorElement) => el.innerText,
      );
      await newPage.close();

      const courseDetails: CourseInterface = {
        title: course.title,
        link: course.link,
        imagen: course.imagen,
        price: price,
        description: description,
      };
      return courseDetails;
    } catch (err) {
      console.warn(
        `Ha ocurrido un error en la extracción de los detalles en el enlace: ${course.link} error: ${err}`,
      );
    }
  }

  private async extractCourseraCourses(
    browser: puppeteer.Browser,
    searchCriteria: string,
  ): Promise<CourseInterface[]> {
    const page = await browser.newPage();
    const url = new URL(this.courUrls.search);
    url.searchParams.set(this.courParams.search, searchCriteria);
    await page.goto(url.toString(), waitLoad);
    const results = await this.extractCourseraResults(page);
    const courses: CourseInterface[] = (
      await Promise.all(
        results.map((link) => this.extractCourseraDetails(link, browser)),
      )
    ).filter((course) => course != undefined);
    await page.close();

    return courses;
  }

  private async extractCourseraResults(
    page: puppeteer.Page,
  ): Promise<CourseInterface[]> {
    const noResults = await page.$(this.courSelectors.noResults);
    if (noResults) return [];

    const imgSelector = this.courSelectors.course.image;
    const titleSelector = this.courSelectors.course.title;
    const results = await page.$$eval(
      this.courSelectors.results,
      (options, imgSelector, titleSelector, maxCourses) => {
        if (options?.length > maxCourses)
          options = options.slice(0, maxCourses);

        return options.map((option: HTMLAnchorElement) => {
          const img: HTMLImageElement = option.querySelector(
            imgSelector as string,
          ) as HTMLImageElement;
          const title: HTMLHeadingElement = option.querySelector(
            titleSelector as string,
          ) as HTMLHeadingElement;
          const course: CourseInterface = {
            link: option.href,
            imagen: img.src,
            title: title.innerText,
          };
          return course;
        });
      },
      imgSelector,
      titleSelector,
      this.courConfig.maxCoursesToScrap,
    );

    return results as CourseInterface[];
  }

  private async extractCourseraDetails(
    course: CourseInterface,
    browser: puppeteer.Browser,
  ): Promise<CourseInterface> {
    console.log('current URL:', course.link);
    const newPage = await browser.newPage();
    await newPage.goto(course.link, waitLoad);
    newPage.setDefaultTimeout(this.puppeteerConfig.timeout);

    try {
      const description = await newPage.$eval(
        this.courConfig.selectors.course.skills,
        (el: HTMLAnchorElement) => el.innerText,
      );
      await newPage.close();

      const courseDetails: CourseInterface = {
        link: course.link,
        imagen: course.imagen,
        description: description,
        title: course.title,
        price: null,
      };
      return courseDetails;
    } catch (err) {
      console.warn(
        `Ha ocurrido un error en la extracción de los detalles en el enlace: ${course.link} error: ${err}`,
      );
    }
  }
}
