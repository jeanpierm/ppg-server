import { Frameworks } from '../enum/frameworks.enum';
import { Languages } from '../enum/languages.enum';

export type LanguagesDictionary = { [key in Languages]?: number };
export type FrameworksDictionary = { [key in Frameworks]?: number };
