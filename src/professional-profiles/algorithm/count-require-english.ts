import { requireEnglish } from '../identifiers/require-english';

export function checkRequireEnglish(
  jobDetail: string,
  jobIndex: number,
): boolean {
  let require = false;
  for (const names of requireEnglish) {
    for (const word of jobDetail) {
      if (names.includes(word)) {
        require = true;
        break;
      }
    }
  }
  console.log(`[Job: ${jobIndex + 1}] require english: ${require}`);
  return require;
}
