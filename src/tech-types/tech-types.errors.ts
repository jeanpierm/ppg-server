export class TechTypeErrors {
  static notFoundById(id: string) {
    return `The technology type with ID "${id}" doesn't exist.`;
  }

  static notFoundByName(name: string) {
    return `The technology type with name "${name}" doesn't exist.`;
  }

  static nameAlreadyExists(name: string) {
    return `The technology type with name "${name}" already exists.`;
  }
}
