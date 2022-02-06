import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { validateOrReject } from 'class-validator';
import { Strategy } from 'passport-local';
import { User } from 'src/users/schemas/users.schema';
import { AuthService } from '../auth.service';
import { LoginRequest } from '../dto/login-request.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    const loginRequest = new LoginRequest({ email, password });
    try {
      await validateOrReject(loginRequest);
    } catch (errors) {
      // TODO mejorar legibilidad
      const constraints = errors.map((error) => error.constraints);
      const messages = constraints
        .map((constraint) => Object.values(constraint))
        .flat();
      throw new BadRequestException(messages);
    }
    const user = await this.authService.validateCredentials(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
