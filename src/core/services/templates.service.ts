import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as hbs from 'handlebars';
import * as path from 'path';

@Injectable()
export class TemplatesService {
  async compile(templateName: string, data?: Record<string, any>) {
    const filePath = path.join(
      process.cwd(),
      'templates',
      `${templateName}.hbs`,
    );
    const html = await fs.readFile(filePath, 'utf8');
    const template = hbs.compile(html);
    return template(data);
  }
}

hbs.registerHelper('join', function (array: Array<string>) {
  return array.join(', ');
});
