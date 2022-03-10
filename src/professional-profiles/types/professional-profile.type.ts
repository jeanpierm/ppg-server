export type TechCountDictionary = Record<string, number>;
export type TechCountDictionaryWithMeta = {
  name: string;
  identifier: Identifier;
  dictionary: TechCountDictionary;
};
export type Identifier = Record<string, string[]>;
