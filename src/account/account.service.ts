import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { UsersMapper } from 'src/users/mapper/users.mapper';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { EmailService } from '../core/services/email.service';
import { AccountResponse } from './dto/account-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Token, TokenDocument } from './schemas/token.schema';
@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    @InjectModel(Token.name)
    private readonly tokensModel: Model<TokenDocument>,
  ) {}

  async get(user: User): Promise<AccountResponse> {
    const account = UsersMapper.toAccountResponse(user);
    this.logger.log('Account obtained successfully');
    return account;
  }

  async update(user: User, updateAccount: UpdateAccountDto): Promise<void> {
    await this.usersService.updateById(user.userId, updateAccount);
    this.logger.log('Account updated successfully');
  }

  async updatePassword(
    user: User,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const passwordMatch = await compare(currentPassword, user.password);
    if (!passwordMatch) {
      this.logger.error(
        'Error trying to update password: passwords do not match',
      );
      throw new BadRequestException('Invalid password');
    }
    await this.usersService.updatePasswordByEmail(user.email, newPassword);
    this.logger.log('Password updated successfully');
  }

  async recoverPassword(email: string, host: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    const token = await this.tokensModel.findOne({ email });

    if (token) await token.deleteOne();
    const resetToken = crypto.randomBytes(32).toString('hex');
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(resetToken, salt);
    await this.tokensModel.create({ user: user._id, token: hash });
    await this.emailService.sendRecoverPasswordMail({ user, resetToken, host });
  }

  async resetPassword({
    userId,
    token,
    newPassword,
  }: ResetPasswordDto): Promise<void> {
    const tokenEntity = await this.validateResetPassToken(token, userId);
    this.logger.log('Valid token. Setting new password...');
    await this.usersService.findAndUpdatePasswordById(userId, newPassword);
    this.logger.log(`Password set successfully for user with ID "${userId}"`);
    await tokenEntity.deleteOne();
  }

  async validateResetPassToken(token: string, userId: string) {
    const tokenEntity = await this.tokensModel
      .findOne({ userId })
      .orFail(
        new BadRequestException('Invalid or expired password reset token'),
      );
    const isValid = await bcrypt.compare(token, tokenEntity.token);
    if (!isValid)
      throw new BadRequestException('Invalid or expired password reset token');

    return tokenEntity;
  }
}
