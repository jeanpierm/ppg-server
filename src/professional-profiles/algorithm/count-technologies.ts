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
  // count patterns
  for (const [key, names] of Object.entries(patterns)) {
    if (patternsDict[key] === undefined) {
      patternsDict[key] = 0;
    }
    for (const name of names) {
      if (jobDetail.includes(name)) {
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
  for (const [key, names] of Object.entries(databases)) {
    if (databasesDict[key] === undefined) {
      databasesDict[key] = 0;
    }
    for (const name of names) {
      if (jobDetail.includes(name)) {
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
  for (const [key, names] of Object.entries(frameworks)) {
    if (frameworksDict[key] === undefined) {
      frameworksDict[key] = 0;
    }
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
  for (const [key, names] of Object.entries(languages)) {
    if (languagesDict[key] === undefined) {
      languagesDict[key] = 0;
    }
    for (const name of names) {
      if (jobDetail.includes(name)) {
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
  for (const [key, names] of Object.entries(libraries)) {
    if (librariesDict[key] === undefined) {
      librariesDict[key] = 0;
    }
    for (const name of names) {
      if (jobDetail.includes(name)) {
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
  for (const [key, names] of Object.entries(tools)) {
    if (toolsDict[key] === undefined) {
      toolsDict[key] = 0;
    }
    for (const name of names) {
      if (jobDetail.includes(name)) {
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
