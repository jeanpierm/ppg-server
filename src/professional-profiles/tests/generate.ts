import { generateProfessionalProfile } from '../algorithm/generate-professional-profile';

async function main() {
  const profile = await generateProfessionalProfile();
  console.log('professional profile', profile);
}

main();
