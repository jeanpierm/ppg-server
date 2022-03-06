import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { validateOrReject } from 'class-validator';
import { Strategy } from 'passport-local';
import { HelperService } from 'src/helper/helper.service';
import { User } from 'src/users/schemas/users.schema';
import { AuthService } from '../auth.service';
import { LoginRequest } from '../dto/login-request.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(
    private readonly authService: AuthService,
    private readonly helperService: HelperService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    // class validations
    const loginRequest = new LoginRequest({ email, password });
    await validateOrReject(loginRequest);

    // credentials validation
    const user = await this.authService.validateCredentials(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
