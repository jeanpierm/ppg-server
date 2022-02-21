const languages = {
  nodejs: 5,
  javascript: 1,
  typescript: 2,
  csharp: 0,
  cplusplus: 0,
  go: 0,
  graphql: 0,
  c: 0,
  r: 0,
  pascal: 0,
  fortran: 0,
  ruby: 0,
  perl: 0,
  html: 0,
  php: 0,
  python: 0,
  java: 0,
  kotlin: 0,
  objetivec: 0,
  swift: 0,
  matlab: 0,
  sql: 0,
  css: 0,
  sass: 0,
  xml: 0,
  json: 0,
};

// const languagesAlt = [
//   { name: 'java', count: 5 },
//   { name: 'python', count: 2 },
//   { name: 'javascript', count: 3 },
// ];
// const result = languagesAlt.sort((a, b) => b.count - a.count);
// console.log(result);

console.log(Object.entries(languages));
const sortable = Object.fromEntries(
  Object.entries(languages).sort(([, a], [, b]) => b - a),
);

const array = Object.keys(languages)
  .filter((a) => languages[a] !== 0)
  .sort((a, b) => languages[b] - languages[a]);

console.log(sortable);
const mostPopularLanguages = array.slice(0, 4);
const professionalProfile = {
  languages: mostPopularLanguages,
};
console.log(professionalProfile);
