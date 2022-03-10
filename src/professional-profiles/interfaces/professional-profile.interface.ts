import { TechCountDictionary } from '../types/professional-profile.type';

export interface ScrapJobsResponse {
  languagesDict: TechCountDictionary;
  frameworksDict: TechCountDictionary;
  librariesDict: TechCountDictionary;
  databasesDict: TechCountDictionary;
  patternsDict: TechCountDictionary;
  toolsDict: TechCountDictionary;
  paradigmsDict: TechCountDictionary;
  requireEnglishDict: RequireEnglishDict;
}

export interface RequireEnglishDict {
  requireEnglish: number;
  totalJobs: number;
}
