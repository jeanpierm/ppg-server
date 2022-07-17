export class TechTypeResponseDto {
  readonly techTypeId: string;
  readonly name: string;
  readonly label: string;
  readonly status: string;

  constructor(o: TechTypeResponseDto) {
    Object.assign(this, o);
  }
}
