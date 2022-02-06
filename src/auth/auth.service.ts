import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthConfig } from 'src/config/auth.config';
import { User } from 'src/users/schemas/users.schema';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './dto/jwt-payload.dto';
import { LoginResponse } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly config: AuthConfig;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    this.config = configService.get<AuthConfig>('auth');
  }

  /**
   * Permite verificar las credenciales del usuario al momento de hacer login. Se invoca en la estrategia 'local'.
   *
   * @param email - username of user
   * @param pass - password of user
   * @returns - Si las credenciales son válidas, retorna un objeto, caso contrario null.
   */
  async validateCredentials(email: string, pass: string): Promise<any> | null {
    const user = await this.usersService.findByEmail(email);
    const isValid = user.password === pass;
    if (isValid) {
      const { email } = user;
      return { email };
    }
    return null;
  }

  async verify(token: string): Promise<User> {
    const payload: JwtPayload = this.jwtService.verify(token, {
      secret: this.config.jwt.secretKey,
    });
    const userEmail = payload.sub;
    const user = await this.usersService.findByEmail(userEmail);
    return user;
  }

  async login(user: User): Promise<LoginResponse> {
    const payload: JwtPayload = {
      sub: user.email,
    };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
