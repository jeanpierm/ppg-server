import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/users/schemas/users.schema';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { Public } from './decorators/public.decorator';
import { LoginResponse } from './dto/login-response.dto';
import { RefreshResponse } from './dto/refresh-response.dto';
import { RegisterRequest } from './dto/register-request.dto';
import { RegisterResponse } from './dto/register-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  async login(@CurrentUser() user: User): Promise<LoginResponse> {
    return this.authService.login(user);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @Public()
  async register(@Body() registerRequest: RegisterRequest): Promise<RegisterResponse> {
    return this.authService.register(registerRequest);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@CurrentUser() user: User): Promise<RefreshResponse> {
    return this.authService.refresh(user);
  }
}
