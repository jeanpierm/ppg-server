const requireEnglish = [
  'advanced english',
  'advanced fluent english',
  'english language proficiency',
  'fluent english',
  'inglés avanzado',
  'require english',
  'requirements english',
];

export function checkRequireEnglish(
  jobDetail: string,
  jobIndex: number,
): boolean {
  let require = false;
  for (const englishName of requireEnglish) {
    if (jobDetail.includes(englishName)) {
      require = true;
      break;
    }
  }
  console.log(`[Job: ${jobIndex + 1}] require english: ${require}`);
  return require;
}
