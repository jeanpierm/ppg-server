export function countRequireEnglish(jobDetails: string[]): number {
  let requiereCounter = 0;
  const requireEnglish = [
    'advanced english',
    'advanced fluent english',
    'english language proficiency',
    'fluent english',
    'inglés avanzado',
    'require english',
    'requirements english',
  ];
  for (const [jobIndex, jobDetail] of jobDetails.entries()) {
    for (const englishName of requireEnglish) {
      if (jobDetail.includes(englishName)) {
        ++requiereCounter;
        console.log(`[Job ${jobIndex + 1}] require english`);
        break;
      }
    }
  }
  return requiereCounter;
}
