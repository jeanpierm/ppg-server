import { User } from '../../users/schemas/user.schema';

export interface SendRecoverPasswordMailData {
  user: User;
  resetToken: string;
  host: string;
}
