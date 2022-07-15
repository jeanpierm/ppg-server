import { TechTypeResponseDto } from './dto/tech-type-response.dto';
import { TechType, TechTypeDocument } from './schemas/tech-type.schema';

export class TechTypesMapper {
  static toResponse(techType: TechType): TechTypeResponseDto {
    return new TechTypeResponseDto({
      techTypeId: (techType as TechTypeDocument)._id,
      label: techType.label,
      name: techType.name,
    });
  }
}
