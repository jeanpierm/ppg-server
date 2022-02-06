import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  readonly currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 30)
  readonly newPassword: string;
}
