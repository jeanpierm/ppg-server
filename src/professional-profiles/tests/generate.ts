import { algorithmGeneratePPG } from '../algorithm/algorithm.generate-ppg';

async function main() {
  const profile = await algorithmGeneratePPG(
    null,
    'backend developer',
    'guayaquil, guayas, ecuador',
  );
  console.log('professional profile', profile);
}

main();
