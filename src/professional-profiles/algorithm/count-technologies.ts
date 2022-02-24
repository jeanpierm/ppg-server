import { patterns } from '../identifiers/patterns';
import { databases } from '../identifiers/databases';
import { frameworks } from '../identifiers/frameworks';
import { languages } from '../identifiers/languages';
import { libraries } from '../identifiers/libraries';
import { tools } from '../identifiers/tools';
import { paradigms } from '../identifiers/paradigms';
import {
  TechDictionary,
  TechDictionaryWithMeta,
  Identifier,
} from '../types/professional-profile.type';

/**
 * Cuenta el número de veces que se repite una tecnología (lenguaje, framework, herramienta, entre otros).
 *
 * Esta función modifica por referencia a los diccionarios de tecnologías.
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
  paradigmsDict: TechDictionary,
) {
  console.log(`[Job ${jobIndex + 1}] detail: ${jobDetail}`);

  const dictionaries: TechDictionaryWithMeta[] = [
    { name: 'language', identifier: languages, dictionary: languagesDict },
    { name: 'framework', identifier: frameworks, dictionary: frameworksDict },
    { name: 'library', identifier: libraries, dictionary: librariesDict },
    { name: 'database', identifier: databases, dictionary: databasesDict },
    { name: 'pattern', identifier: patterns, dictionary: patternsDict },
    { name: 'tool', identifier: tools, dictionary: toolsDict },
    { name: 'paradigm', identifier: paradigms, dictionary: paradigmsDict },
  ];

  for (const { name, identifier, dictionary } of dictionaries) {
    countTechnology(name, dictionary, identifier, jobDetail, jobIndex);
  }
}

/**
 * Añade 1 al contador si se encuentra a una tecnología de desarrollo de software en la descripción de la oferta trabajo.
 *
 * Solo añade 1 por oferta de trabajo (sin importar las veces que se repita en la misma descripción).
 *
 * @param dictName
 * @param dictionary
 * @param identifier
 * @param jobDetail
 * @param jobIndex
 */
function countTechnology(
  dictName: string,
  dictionary: TechDictionary,
  identifier: Identifier,
  jobDetail: string,
  jobIndex: number,
) {
  for (const [techKey, techNames] of Object.entries(identifier)) {
    if (dictionary[techKey] === undefined) {
      dictionary[techKey] = 0;
    }
    for (const name of techNames) {
      if (jobDetail.includes(` ${name} `)) {
        ++dictionary[techKey];
        console.log(
          `[Job: ${jobIndex + 1}] ${dictName} "${techKey}" found! (count: ${
            dictionary[techKey]
          })`,
        );
        break;
      }
    }
  }
}
