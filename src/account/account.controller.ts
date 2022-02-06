import { Controller, Get, Logger, Patch, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponse } from 'src/shared/dto/response.dto';
import { User } from 'src/users/schemas/users.schema';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(private readonly accountService: AccountService) {}

  /**
   * Obtiene los datos de la cuenta.
   * @param user - Usuario actual autenticado asociado al JWT.
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getData(@CurrentUser() user: User): Promise<ApiResponse<User>> {
    return new ApiResponse('Account data obtained successfully', user);
  }

  /**
   * Actualiza la contraseña con la contraseña actual.
   */
  @Patch('password')
  @UseGuards(JwtAuthGuard)
  async updatePassword(): Promise<ApiResponse> {
    // TODO
    return new ApiResponse('Password updated successfully');
  }
}
