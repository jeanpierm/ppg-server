export class ProfesionalProfileResponse {
  readonly languages: string[];

  readonly frameworks: string[];

  readonly databases: string[];

  readonly patterns: string[];

  readonly tools: string[];

  readonly requireEnglish: boolean;

  readonly requireTitle: boolean;

  constructor(partial: Partial<ProfesionalProfileResponse>) {
    Object.assign(this, partial);
  }
}
