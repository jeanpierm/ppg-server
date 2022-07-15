export class TechnologyResponse {
  readonly technologyId: string;
  readonly type: string;
  readonly name: string;
  readonly identifiers: string[];

  constructor(dto: TechnologyResponse) {
    Object.assign(this, dto);
  }
}
