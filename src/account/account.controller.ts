import { Body, Controller, Get, Logger, Patch } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { User } from 'src/users/schemas/users.schema';
import { AccountService } from './account.service';
import { AccountResponse } from './dto/account-response.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('account')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(private readonly accountService: AccountService) {}

  /**
   * Obtiene los datos de la cuenta del usuario.
   * @param user - Usuario actual autenticado asociado al JWT.
   */
  @Get()
  @Roles(Role.User, Role.Admin)
  async get(@CurrentUser() user: User): Promise<ApiResponse<AccountResponse>> {
    const account = await this.accountService.get(user);
    return new ApiResponse('Account data obtained successfully', account);
  }

  /**
   * Actualiza los datos de la cuenta del usuario.
   */
  @Patch()
  @Roles(Role.User, Role.Admin)
  async update(
    @CurrentUser() user: User,
    @Body() updateAccount: UpdateAccountDto,
  ): Promise<ApiResponse> {
    await this.accountService.update(user, updateAccount);
    return new ApiResponse('Account updated successfully');
  }

  /**
   * Actualiza la contraseña con la contraseña actual.
   */
  @Patch('password')
  @Roles(Role.User, Role.Admin)
  async updatePassword(
    @CurrentUser() user: User,
    @Body() { currentPassword, newPassword }: UpdatePasswordDto,
  ): Promise<ApiResponse> {
    await this.accountService.updatePassword(
      user,
      currentPassword,
      newPassword,
    );
    return new ApiResponse('Password updated successfully');
  }
}
