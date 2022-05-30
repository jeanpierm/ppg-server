import { Technology } from '../../technologies/schemas/technology.schema';

/**
 * Añade 1 al contador si se encuentra a una tecnología de desarrollo de software en la descripción de la oferta trabajo.
 *
 * Solo añade 1 por oferta de trabajo (sin importar las veces que se repita en la misma descripción).
 */
export function countTechnology(
  technologies: Technology[],
  jobDetails: string[],
): Record<string, number> {
  const countDictionary: Record<string, number> = {};
  for (const [jobIndex, jobDetail] of jobDetails.entries()) {
    for (const { type, name, identifiers } of technologies) {
      if (countDictionary[name] === undefined) {
        countDictionary[name] = 0;
      }
      for (const identifier of identifiers) {
        if (jobDetail.includes(` ${identifier} `)) {
          ++countDictionary[name];
          console.log(
            `[Job ${jobIndex + 1}] ${type} "${name}" found! (count: ${
              countDictionary[name]
            })`,
          );
          break;
        }
      }
    }
    console.debug(`[Job ${jobIndex + 1}] finished scraping`);
  }
  return countDictionary;
}
