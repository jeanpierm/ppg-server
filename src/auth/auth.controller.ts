import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/users/schemas/users.schema';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { LoginResponse } from './dto/login-response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: User): Promise<LoginResponse> {
    return this.authService.login(user);
  }
}
