import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LinkedInConfig } from '../../config/linkedin.config';
import * as puppeteer from 'puppeteer';
import {
  getImageSrc,
  getTextContent,
  waitLoad,
} from '../../professional-profiles/utils';
import { JobIntf } from '../../professional-profiles/interfaces/job.interface';
import { WorkPlace } from '../../professional-profiles/types/workplace.type';
import { PuppeteerConfig } from '../../config/puppeteer.config';
import * as fs from 'fs-extra';
import * as path from 'path';
@Injectable()
export class LinkedInScraperService {
  private readonly config = this.configService.get<LinkedInConfig>('linkedin');
  private readonly puppeteerConfig =
    this.configService.get<PuppeteerConfig>('puppeteer');
  private readonly urls = this.config.urls;
  private readonly account = this.config.account;
  private readonly selectors = this.config.selectors;
  private readonly screenshotsPath = path.join(process.cwd(), 'screenshots');

  constructor(private readonly configService: ConfigService) {}

  async getJobs(jobTitle: string, location: string): Promise<JobIntf[]> {
    try {
      const browser = await puppeteer.launch(this.puppeteerConfig.options);
      const page = await browser.newPage();
      await this.setLanguageInEnglish(page);
      await page.setViewport({ width: 1920, height: 1080 });
      await this.login(page);
      await this.searchJobs(page, jobTitle, location);
      const jobLinks = await this.scrapJobLinks(page);
      const jobs = (
        await Promise.all(
          jobLinks.map((link, i) => this.extractJobMetadata(browser, link, i)),
        )
      ).filter((job) => job !== undefined);
      await browser.close();
      return jobs;
    } catch (err) {
      console.error(`An error has ocurred while scraping jobs offers.`, err);
      throw new InternalServerErrorException(
        `An error has ocurred while scraping jobs offers.`,
        err.message,
      );
    }
  }

  private async setLanguageInEnglish(page: puppeteer.Page) {
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en',
    });
  }

  /**
   * Inicia sesión en LinkedIn.
   *
   * Es necesario iniciar sesión para buscar ofertas de trabajo.
   * @param page
   */
  private async login(page: puppeteer.Page) {
    await page.goto(this.urls.login, waitLoad);

    await fs.ensureDir(this.screenshotsPath);
    await page.screenshot({
      path: path.join(this.screenshotsPath, 'linkedin-0.png'),
    });

    await page.type(this.selectors.inputUsername, this.account.user);
    await page.type(this.selectors.inputPassword, this.account.password);
    await page.$eval(this.selectors.formLogin, (form: HTMLFormElement) =>
      form.submit(),
    );
    await page.waitForNavigation();

    await fs.ensureDir(this.screenshotsPath);
    await page.screenshot({
      path: path.join(this.screenshotsPath, 'linkedin-1.png'),
    });

    console.debug('Login successfully');
  }

  /**
   * Se dirige a la página de trabajos y busca ofertas.
   * @param page
   * @param jobTitle - título del trabajo a buscar
   * @param location - localidad del trabajo
   */
  private async searchJobs(
    page: puppeteer.Page,
    jobTitle: string,
    location: string,
  ) {
    const jobsUrl = this.getEncodedSearchJobsUrl(jobTitle, location);
    await page.goto(jobsUrl, waitLoad);
    console.debug(
      `Jobs searched successfully with title: "${jobTitle}" and location "${location}"`,
    );
  }

  /**
   * @param jobTitle
   * @param location
   * @returns el URL de la búsqueda de trabajos según el jobTitle y location
   */
  private getEncodedSearchJobsUrl(jobTitle: string, location: string): string {
    const url = new URL(this.urls.searchJobs);
    url.searchParams.set('keywords', jobTitle);
    url.searchParams.set('location', location);
    return url.toString();
  }

  /**
   * @param page
   * @returns Devuelve los enlaces de las ofertas de trabajo encontradas.
   */
  private async scrapJobLinks(page: puppeteer.Page): Promise<string[]> {
    const links = await page.evaluate((elementSelector) => {
      const elements = document.querySelectorAll(elementSelector);
      return Array.from(elements).map(
        (element: HTMLLinkElement) => element.href,
      );
    }, this.selectors.job.element);
    console.debug(`Job links scrapped successfully`);

    await page.screenshot({
      path: path.join(this.screenshotsPath, 'linkedin-2.png'),
    });

    await page.close();
    console.debug(`Job links count: ${links.length}:`, links);
    return links;
  }

  /**
   * Abre una nueva pestaña y navega hacia el enlace de la oferta de trabajo, espera a que se carguen los detalles del trabajo y luego extrae
   * los detalles del trabajo.
   * @param {Browser} browser - Browser: el navegador del web scrapper
   * @param {string} url - el enlace a la página de detalles del trabajo
   * @param {number} i - el índice del trabajo en la lista de trabajos
   * @returns Un string con el detalle del trabajo
   */
  private async extractJobMetadata(
    browser: puppeteer.Browser,
    url: string,
    i: number,
  ): Promise<JobIntf> {
    try {
      const { job: jobSelectors } = this.selectors;
      const page = await browser.newPage();
      await page.goto(url, waitLoad);
      page.setDefaultTimeout(10000);
      await page.waitForSelector(jobSelectors.details);

      const title = await getTextContent(page, jobSelectors.title);
      const detail = await getTextContent(page, jobSelectors.details);
      const company = {
        name: await getTextContent(page, jobSelectors.company.name),
        photoUrl: await getImageSrc(page, jobSelectors.company.photo),
      };
      const location = await getTextContent(page, jobSelectors.location);
      const workplaceType = await getTextContent(
        page,
        jobSelectors.workplaceType,
      );
      await page.close();

      const job: JobIntf = {
        title,
        detail,
        company,
        location,
        url,
        workplaceType: workplaceType as WorkPlace,
      };
      console.log(`[Job ${i + 1}] extracted successfully`);
      console.log(`[Job ${i + 1}]:`, job, '\n');

      return job;
    } catch (err) {
      console.error(err);
    }
  }
}
