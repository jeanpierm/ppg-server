import { TechTypeResponseDto } from './dto/tech-type-response.dto';
import { TechType } from './schemas/tech-type.schema';

export class TechTypesMapper {
  static toResponse(techType: TechType): TechTypeResponseDto {
    return new TechTypeResponseDto({
      techTypeId: techType._id.toHexString(),
      label: techType.label,
      name: techType.name,
      status: techType.status,
    });
  }
}
