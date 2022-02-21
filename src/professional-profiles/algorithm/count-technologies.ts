import { patterns } from '../identifiers/patterns';
import { databases } from '../identifiers/databases';
import { frameworks } from '../identifiers/frameworks';
import { languages } from '../identifiers/languages';
import { libraries } from '../identifiers/libraries';
import { tools } from '../identifiers/tools';
import { TechDictionary } from './types';

/**
 * Cuenta el número de veces que se repite una tecnología (lenguaje, framework, herramienta, entre otros).
 * Esta función modifica por referencia a los diccionarios de tecnologias.
 * @param jobDetail
 * @param jobIndex
 * @param languagesDict
 * @param frameworksDict
 */
export function countTechnologies(
  jobDetail: string,
  jobIndex: number,
  languagesDict: TechDictionary,
  frameworksDict: TechDictionary,
  librariesDict: TechDictionary,
  databasesDict: TechDictionary,
  patternsDict: TechDictionary,
  toolsDict: TechDictionary,
) {
  const jobDetailSplitted = jobDetail.split(' ');

  // count patterns
  for (const names of Object.values(patterns)) {
    const key = names[0];
    if (patternsDict[key] === undefined) {
      patternsDict[key] = 0;
    }
    for (const word of jobDetailSplitted) {
      if (names.includes(word)) {
        ++patternsDict[key];
        console.log(
          `[Job: ${jobIndex + 1}] Pattern "${key}" found! (count: ${
            patternsDict[key]
          })`,
        );
        break;
      }
    }
  }
  // count databases
  for (const names of Object.values(databases)) {
    const key = names[0];
    if (databasesDict[key] === undefined) {
      databasesDict[key] = 0;
    }
    for (const word of jobDetailSplitted) {
      if (names.includes(word)) {
        ++databasesDict[key];
        console.log(
          `[Job: ${jobIndex + 1}] Database "${key}" found! (count: ${
            databasesDict[key]
          })`,
        );
        break;
      }
    }
  }
  // count frameworks
  for (const names of Object.values(frameworks)) {
    const key = names[0];
    if (frameworksDict[key] === undefined) {
      frameworksDict[key] = 0;
    }
    // for (const word of jobDetailSplitted) {
    //   if (names.includes(word)) {
    //     ++frameworksDict[key];
    //     console.log(
    //       `[Job: ${jobIndex + 1}] Framework "${key}" found! (count: ${
    //         frameworksDict[key]
    //       })`,
    //     );
    //     break;
    //   }
    // }
    for (const name of names) {
      if (jobDetail.includes(name)) {
        ++frameworksDict[key];
        console.log(
          `[Job: ${jobIndex + 1}] Framework "${key}" found! (count: ${
            frameworksDict[key]
          })`,
        );
        break;
      }
    }
  }
  // count languages
  for (const names of Object.values(languages)) {
    const key = names[0];
    if (languagesDict[key] === undefined) {
      languagesDict[key] = 0;
    }
    for (const word of jobDetailSplitted) {
      if (names.includes(word)) {
        ++languagesDict[key];
        console.log(
          `[Job: ${jobIndex + 1}] Language "${key}" found! (count: ${
            languagesDict[key]
          })`,
        );
        break;
      }
    }
  }
  // count libraries
  for (const names of Object.values(libraries)) {
    const key = names[0];
    if (librariesDict[key] === undefined) {
      librariesDict[key] = 0;
    }
    for (const word of jobDetailSplitted) {
      if (names.includes(word)) {
        ++librariesDict[key];
        console.log(
          `[Job: ${jobIndex + 1}] Library "${key}" found! (count: ${
            librariesDict[key]
          })`,
        );
        break;
      }
    }
  }
  // count tools
  for (const names of Object.values(tools)) {
    const key = names[0];
    if (toolsDict[key] === undefined) {
      toolsDict[key] = 0;
    }
    for (const word of jobDetailSplitted) {
      if (names.includes(word)) {
        ++toolsDict[key];
        console.log(
          `[Job: ${jobIndex + 1}] Tool "${key}" found! (count: ${
            toolsDict[key]
          })`,
        );
        break;
      }
    }
  }
}
