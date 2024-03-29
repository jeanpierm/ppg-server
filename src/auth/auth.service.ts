import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { AuthConfig } from 'src/config/auth.config';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { AccountResponse } from '../account/dto/account-response.dto';
import { UsersMapper } from '../users/mapper/users.mapper';
import { JwtPayload } from './dto/jwt-payload.dto';
import { LoginResponse } from './dto/login-response.dto';
import { RefreshResponse } from './dto/refresh-response.dto';
import { RegisterRequest } from './dto/register-request.dto';
import { RegisterResponse } from './dto/register-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly config: AuthConfig =
    this.configService.get<AuthConfig>('auth');

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Permite verificar las credenciales del usuario al momento de hacer login. Se invoca en la estrategia 'local'.
   *
   * @param email - username of user
   * @param pass - password of user
   * @returns - Si las credenciales son válidas, retorna un objeto con data referente al usuario, caso contrario null.
   */
  async validateCredentials(email: string, pass: string): Promise<any> | null {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      this.logger.log('User not fount');
      return null;
    }
    const passwordMatch = await compare(pass, user.password);
    if (!passwordMatch) {
      this.logger.warn('Invalid credentials');
      return null;
    }
    this.logger.log('Valid credentials');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;

    return result;
  }

  async verify(token: string): Promise<User> {
    const payload: JwtPayload = this.jwtService.verify(token, {
      secret: this.config.jwt.secretKey,
    });
    const user = await this.usersService.findById(payload.sub);
    return user;
  }

  /**
   * Permite la autenticación del usuario, generando su token de acceso JWT.
   *
   * @param user - El usuario actualmente autenticado.
   * @returns Un objeto con el JWT del usuario autenticado.
   */
  async login(user: User): Promise<LoginResponse> {
    const payload: JwtPayload = {
      sub: user.userId,
    };
    const accountData: AccountResponse = UsersMapper.toAccountResponse(user);
    return { accessToken: this.jwtService.sign(payload), accountData };
  }

  async refresh(user: User): Promise<RefreshResponse> {
    return this.login(user);
  }

  /**
   * Registra una nueva cuenta creada por un usuario.
   *
   * @param registerRequest - DTO con los datos para la creación del usuario
   * @returns Un objeto con el JWT del usuario registrado y autenticado
   */
  async register(registerRequest: RegisterRequest): Promise<RegisterResponse> {
    const user = await this.usersService.create(registerRequest);
    return this.login(user);
  }
}
