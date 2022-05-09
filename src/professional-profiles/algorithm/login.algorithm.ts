import puppeteer = require('puppeteer');
import { waitLoad } from './util';

const loginUrl = 'https://www.linkedin.com/login';
const username = 'tesis.tecnologias.ug@gmail.com';
const password = 'Uhm)=UyK4+BD"*=';

const usernameSelector = '#username';
const passwordSelector = '#password';
const formSelector = '.login__form';

/**
 * Inicia sesión en LinkedIn.
 *
 * Es necesario iniciar sesión para buscar ofertas de trabajo.
 * @param page
 */
export async function login(page: puppeteer.Page) {
  await page.goto(loginUrl, waitLoad);
  await page.type(usernameSelector, username);
  await page.type(passwordSelector, password);
  await page.$eval(formSelector, (form: HTMLFormElement) => form.submit());
  await page.waitForNavigation();
  console.debug('Login successfully');
}
