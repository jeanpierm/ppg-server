const person = undefined;

function getPerson(person = { name: 'jeanpier' }) {
  return person;
}
console.log(getPerson(person));
