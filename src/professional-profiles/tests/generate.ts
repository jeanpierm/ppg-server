import { generateProfesionalProfile } from '../algorithm/generate-professional-profile';

async function main() {
  const profile = await generateProfesionalProfile();
  console.log('profesional profile', profile);
}

main();
