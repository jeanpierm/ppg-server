import { Frameworks } from '../enum/frameworks.enum';
import { Languages } from '../enum/languages.enum';
import { FrameworksDictionary, LanguagesDictionary } from './types';

export function countSkills(
  jobDetail: string,
  jobIndex: number,
  languages: LanguagesDictionary,
  frameworks: FrameworksDictionary,
) {
  const jobDetailSplitted = jobDetail.split(' ');

  // count languages
  for (const language of Object.values(Languages)) {
    if (languages[language] === undefined) {
      languages[language] = 0;
    }
    for (const word of jobDetailSplitted) {
      if (word === language) {
        if (language in languages) {
          ++languages[language];
          console.log(
            `[Job: ${jobIndex + 1}] Language "${language}" found! (count: ${
              languages[language]
            })`,
          );
          break;
        } else {
          languages[language] = 1;
          console.log(
            `[Job: ${jobIndex + 1}] Language "${language}" found! (count: 1)`,
          );
          break;
        }
      }
    }
  }

  // count frameworks
  for (const framework of Object.values(Frameworks)) {
    if (frameworks[framework] === undefined) {
      frameworks[framework] = 0;
    }
    for (const word of jobDetailSplitted) {
      if (word === framework) {
        if (framework in frameworks) {
          ++frameworks[framework];
          console.log(
            `[Job: ${jobIndex + 1}] Framework "${framework}" found! (count: ${
              frameworks[framework]
            })`,
          );
          break;
        } else {
          frameworks[framework] = 1;
          console.log(
            `[Job: ${jobIndex + 1}] Framework "${framework}" found! (count: 1)`,
          );
          break;
        }
      }
    }
  }
}
