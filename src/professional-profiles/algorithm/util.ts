import puppeteer = require('puppeteer');

/**
 * Espera hasta que cargue el contenido de la página web.
 */
export const waitLoad: puppeteer.WaitForOptions = { waitUntil: 'networkidle2' };

export const k = 10 ** 3;
