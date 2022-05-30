import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/schemas/user.schema';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { Public } from './decorators/public.decorator';
import { LoginRequest } from './dto/login-request.dto';
import { LoginResponse } from './dto/login-response.dto';
import { RefreshResponse } from './dto/refresh-response.dto';
import { RegisterRequest } from './dto/register-request.dto';
import { RegisterResponse } from './dto/register-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Inicia sesión con las credenciales de un usuario (correo electrónico y contraseña). Si las credenciales son correctas, se obtiene un token de acceso de tipo JWT (JSON Web Token) del usuario.
   */
  @ApiOperation({ summary: 'iniciar sesión' })
  @ApiBody({ type: LoginRequest })
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@CurrentUser() user: User): Promise<LoginResponse> {
    return this.authService.login(user);
  }

  /**
   * Registra un nuevo usuario. Cuando se lo crea, le asigna el rol por defecto "user". Si la creación es exitosa, inicia sesión y se obtiene un token de acceso de tipo JWT (JSON Web Token) del usuario.
   */
  @ApiOperation({ summary: 'registrar usuario' })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @Public()
  async register(
    @Body() registerRequest: RegisterRequest,
  ): Promise<RegisterResponse> {
    return this.authService.register(registerRequest);
  }

  /**
   * Renueva el token de acceso del usuario, enviando un nuevo token de acceso de tipo JWT (JSON Web Token) del usuario.
   */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'renovar token' })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@CurrentUser() user: User): Promise<RefreshResponse> {
    return this.authService.refresh(user);
  }
}
