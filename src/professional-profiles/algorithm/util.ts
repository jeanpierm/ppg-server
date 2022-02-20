import puppeteer = require('puppeteer');

/**
 * Espera hasta que cargue el contenido de la página web.
 */
export const waitLoad: puppeteer.WaitForOptions = { waitUntil: 'networkidle2' };

/**
 * @param jobDetail
 * @returns una descripción de oferta de trabajo sin caracteres y espacios innecesarios o que puedan perjudicar la integridad del web scrapping.
 */
export function normalizeJobDetail(jobDetail: string): string {
  return jobDetail
    .toLowerCase()
    .replace(/[,;:]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\//g, ' ');
}

export const k = 10 ** 3;
