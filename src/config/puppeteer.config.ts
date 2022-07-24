import { registerAs } from '@nestjs/config';
import * as puppeteer from 'puppeteer';

export interface PuppeteerConfig {
  options: puppeteer.LaunchOptions & puppeteer.BrowserLaunchArgumentOptions;
}

export default registerAs('puppeteer', () => ({
  options:
    process.env.NODE_ENV === 'production'
      ? {
          headless: true,
        }
      : { headless: false },
}));
