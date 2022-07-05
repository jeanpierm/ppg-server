import { ProfessionalProfile } from 'src/professional-profiles/schemas/professional-profile.schema';
import { DownloadPreferences } from '../schema/download-preferences.schema';
import carboneSDKApi = require('carbone-sdk');
const carboneSDK = carboneSDKApi(
  'test_eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIzOTg1MDk1MzA0MDczMzYyNjUiLCJhdWQiOiJjYXJib25lIiwiZXhwIjoyMzE5MjIxMjM5LCJkYXRhIjp7ImlkQWNjb3VudCI6IjM5ODUwOTUzMDQwNzMzNjI2NSJ9fQ.ATSyO4hIYMO5Zz_PPK4AYqOl88WhTFJiHvT74ABvM6Dy41UGX5yME2DvEERo_h-xOvTY-pcDwDLV7r6QE2XH4aU1AH_Gf-rDPZAXdRw8Gica7zBUvppxKKEaPXGeHjmdbM6UeR18a6SSVl_MwBpMpWPRka4vKjq3_kbbEwLxAYcXPnlf',
);
import path = require('path');
import fs = require('fs');

export function resume(
  profile: ProfessionalProfile,
  preferences: DownloadPreferences,
) {
  /* const data = {
    pp: profile,
    preferences: preferences,
  };
  const options = {
    convertTo: 'pdf', //can be docx, txt, ...
  };

  carboneSDK.render(
    'src/assets/resume.odt',
    data,
    options,
    function (err, result) {
      if (err) {
        return console.log(err);
      }
      // write the result
      console.log('No error');
      fs.writeFileSync('resume.pdf', result);
    },
  ); */

  const options = {
    data: {
      pp: profile,
      preferences: preferences,
    },
    convertTo: 'pdf',
  };

  // Create a write stream with the report name as parameter.
  const writeStream = fs.createWriteStream('report.pdf');
  // Pass the template path as first parameter, in this example 'test.odt' is the template.
  // Pass the data object as second parameter. path.join('src', 'assets', 'resume.odt')
  const carboneStream = carboneSDK.render(
    path.join(__dirname, '/../../../templates/resume.odt'),
    options,
  );

  carboneStream.on('error', (err) => {
    console.error(err);
  });

  writeStream.on('close', () => {
    console.log('File rendered');
  });

  carboneStream.pipe(writeStream);
}
