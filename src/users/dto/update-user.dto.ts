import { OmitType, PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

// se omite la propiedad "email" para luego agregarla manualmente, ya que en "CrateUserDto" esa propiedad tienen una validación de email no registrado.
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email'] as const),
) {
  @IsEmail()
  @IsOptional()
  email?: string;
}
