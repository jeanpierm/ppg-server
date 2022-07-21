import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { ApiResponse } from 'src/shared/dto/api-response.dto';
import { User } from 'src/users/schemas/user.schema';
import { ApiOkCustomResponse } from '../shared/decorators/api-response.decorator';
import { AccountService } from './account.service';
import { AccountResponse } from './dto/account-response.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Public } from '../auth/decorators/public.decorator';
import { RecoverPassDto } from './dto/recover-pass-dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ValidateResetPasswordToken } from './dto/validate-reset-pass-token.dto';

@ApiTags('account')
@ApiBearerAuth()
@Controller('account')
export class AccountController {
  private readonly logger = new Logger(AccountController.name);

  constructor(private readonly accountService: AccountService) {}

  /**
   * Obtiene los datos de la cuenta de usuario perteneciente al token (JWT).
   */
  @Get()
  @ApiOperation({ summary: 'obtener datos de la cuenta' })
  @ApiOkCustomResponse(AccountResponse)
  @Roles(Role.User, Role.Admin)
  async get(@CurrentUser() user: User): Promise<ApiResponse<AccountResponse>> {
    const account = await this.accountService.get(user);
    return new ApiResponse('Account data obtained successfully', account);
  }

  /**
   * Actualiza los datos de la cuenta del usuario.
   */
  @ApiOperation({ summary: 'actualizar datos de la cuenta' })
  @ApiOkResponse({ type: ApiResponse })
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
  @ApiOperation({ summary: 'actualizar contraseña' })
  @ApiOkResponse({ type: ApiResponse })
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

  /**
   * Envía al usuario un correo electrónico para recuperar su contraseña
   */
  @ApiOperation({ summary: 'send recover password email' })
  @ApiAcceptedResponse({ type: ApiResponse })
  @Post('recover-password')
  @HttpCode(HttpStatus.ACCEPTED)
  @Public()
  async recoverPassword(@Body() { email }: RecoverPassDto) {
    await this.accountService.recoverPassword(email);
    return new ApiResponse('Password reset link sent to email successfully');
  }

  /**
   * Se establece una nueva contraseña a través del token obtenido del enlace para recuperar contraseña
   */
  @ApiOperation({ summary: 'set new password by recovery process' })
  @ApiAcceptedResponse({ type: ApiResponse })
  @Post('reset-password')
  @Public()
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.accountService.resetPassword(resetPasswordDto);
    return new ApiResponse('Password set successfully');
  }

  /**
   * Validate que el token para restablecer sea correcto según el ID del usuario asociado
   */
  @ApiOperation({ summary: 'validate reset password token' })
  @Post('reset-password/validate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Public()
  async validateResetPasswordToken(
    @Body() { token, userId }: ValidateResetPasswordToken,
  ) {
    await this.accountService.validateResetPassToken(token, userId);
  }
}
