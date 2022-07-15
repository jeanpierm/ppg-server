export class TechTypeErrors {
  static notFound(name: string) {
    return `The technology type ${name} doesn't exist.`;
  }

  static nameAlreadyExists(name: string) {
    return `The technology type with name ${name} already exists.`;
  }
}
