export type TechDictionary = Record<string, number>;
export type TechDictionaryWithMeta = {
  name: string;
  identifier: Identifier;
  dictionary: TechDictionary;
};
export type Identifier = Record<string, string[]>;
