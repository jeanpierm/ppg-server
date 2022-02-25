import { requireEnglish } from '../identifiers/require-english';

export function checkRequireEnglish(
  jobDetail: string,
  jobIndex: number,
): boolean {
  let require = false;
  for (const name of requireEnglish) {
    if (jobDetail.includes(` ${name} `)) {
      require = true;
      break;
    }
  }
  console.log(`[Job: ${jobIndex + 1}] require english: ${require}`);
  return require;
}
