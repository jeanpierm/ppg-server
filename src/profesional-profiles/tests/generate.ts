import { generateProfesionalProfile } from '../algorithm/generate-profesional-profile';

async function main() {
  const profile = await generateProfesionalProfile();

  console.log(profile);
}

main();
