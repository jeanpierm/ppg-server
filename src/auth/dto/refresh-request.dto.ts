import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshRequest {
  @IsJWT()
  @IsNotEmpty()
  readonly token: string;
}
