import { ProfessionalProfile } from 'src/professional-profiles/schemas/professional-profile.schema';
import { DownloadPreferences } from '../schema/download-preferences.schema';
import PdfPrinter = require('pdfmake');
import fs = require('fs');
import { PageSize } from 'pdfmake/interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { TechTypeProfile } from 'src/professional-profiles/enums/tech-type-profile.enum';
import { PreferencesType } from '../enum/preferences-type.enum';
import datauri = require('datauri');

const fonts = {
  Roboto: {
    normal: 'src/fonts/Roboto-Regular.ttf',
    bold: 'src/fonts/Roboto-Medium.ttf',
    italics: 'src/fonts/Roboto-Italic.ttf',
    bolditalics: 'src/fonts/Roboto-MediumItalic.ttf',
  },
};

@Injectable()
export class PdfResumeMaker {
  private readonly logger = new Logger(PdfResumeMaker.name);

  pdfmake(profile: ProfessionalProfile, preferences: DownloadPreferences) {
    const printer = new PdfPrinter(fonts);
    const pagesize: PageSize = 'LETTER';

    //const datauri = datauri(profile.owner.);
    const docDefinition = {
      pageSize: pagesize,
      content: [
        {
          text: `${profile.owner.name} ${profile.owner.surname}`,
          style: 'header',
        },
        { text: profile.jobTitle },
        {
          text: '---------------------------------------------------------------------------------------------',
          background: 'grey',
          color: 'grey',
        },
      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
        },
        subtitle: {
          fontSize: 14,
          bold: true,
          margin: 10,
        },
      },
      defaultStyle: {
        fontSize: 12,
      },
    };

    this.addColumnBiography(profile, preferences, docDefinition);
    this.addSkill(profile, docDefinition);
    this.addPersonalInfo(profile, preferences, docDefinition);
    console.log(docDefinition);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream('basics.pdf'));
    pdfDoc.end();
  }

  addColumnBiography(
    profile: ProfessionalProfile,
    preferences: DownloadPreferences,
    docDefinition: any,
  ) {
    if (preferences.biography) {
      const biography = {
        columns: [
          {
            width: '20%',
            text: 'Professional sumary',
            style: 'subtitle',
          },
          {
            width: 'auto',
            text: profile.owner.biography,
            margin: 10,
          },
        ],
      };
      docDefinition.content.push(biography);
    }
  }

  addSkill(profile: ProfessionalProfile, docDefinition: any) {
    const body = [];
    for (const type of Object.values(TechTypeProfile)) {
      if (profile[type].length > 0) {
        const row = [
          {
            text: type,
            bold: true,
          },
          profile[type].join(),
        ];
        body.push(row);
      }
    }

    if (body.length > 0) {
      const table = {
        columns: [
          {
            width: '20%',
            text: 'Skills',
            style: 'subtitle',
          },
          {
            width: 'auto',
            margin: 10,
            layout: 'lightHorizontalLines',
            table: {
              widths: ['auto', 'auto'],
              body: body,
            },
          },
        ],
      };

      docDefinition.content.push(table);
    }
  }

  addPersonalInfo(
    profile: ProfessionalProfile,
    preferences: DownloadPreferences,
    docDefinition: any,
  ) {
    const body = [];
    for (const type of Object.values(PreferencesType)) {
      if (preferences[type]) {
        body.push([
          {
            text: type,
            bold: true,
          },
          profile.owner[type],
        ]);
      }
    }

    if (body.length > 0) {
      const table = {
        columns: [
          {
            width: '20%',
            text: 'Personal info',
            style: 'subtitle',
          },
          {
            width: 'auto',
            margin: 10,
            layout: 'lightHorizontalLines',
            table: {
              widths: ['auto', 'auto'],
              body: body,
            },
          },
        ],
      };

      docDefinition.content.push(table);
    }
  }
}
