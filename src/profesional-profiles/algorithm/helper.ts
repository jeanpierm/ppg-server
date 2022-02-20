import puppeteer = require('puppeteer');

export const waitLoad: puppeteer.WaitForOptions = { waitUntil: 'networkidle2' };

export function normalizeJobDetail(jobDetail: string): string {
  return jobDetail
    .toLowerCase()
    .replace(/[,;:]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\//g, ' ');
}

export const k = 10 ** 3;
