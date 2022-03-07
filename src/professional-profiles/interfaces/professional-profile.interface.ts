import { TechDictionary } from '../types/professional-profile.type';

export interface ScrapJobsResponse {
  languagesDict: TechDictionary;
  frameworksDict: TechDictionary;
  librariesDict: TechDictionary;
  databasesDict: TechDictionary;
  patternsDict: TechDictionary;
  toolsDict: TechDictionary;
  paradigmsDict: TechDictionary;
  requireEnglishDict: RequireEnglishDict;
}

export interface RequireEnglishDict {
  requireEnglish: number;
  totalJobs: number;
}