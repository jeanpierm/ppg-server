import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import * as nodemailer from 'nodemailer';
import { UsersMapper } from 'src/users/mapper/users.mapper';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ClientConfig } from '../config/client.config';
import { EmailService } from '../core/services/email.service';
import { TemplatesService } from '../core/services/templates.service';
import { AccountResponse } from './dto/account-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Token, TokenDocument } from './schemas/token.schema';
@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);
  private readonly clientConfig =
    this.configService.get<ClientConfig>('client');

  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
    @InjectModel(Token.name)
    private readonly tokensModel: Model<TokenDocument>,
    private readonly configService: ConfigService,
    private readonly templatesService: TemplatesService,
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

  async recoverPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    const token = await this.tokensModel.findOne({ email });

    if (token) await token.deleteOne();
    const resetToken = crypto.randomBytes(32).toString('hex');
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(resetToken, salt);
    await this.tokensModel.create({ user: user._id, token: hash });
    await this.sendRecoverPasswordMail(user, resetToken);
  }

  private async sendRecoverPasswordMail(user: User, resetToken) {
    const resetLink = this.getResetLink(resetToken, user._id.toHexString());
    const html = await this.getRecoverPasswordHtml(user, resetLink);
    const subject = 'Recupera tu contraseña';
    const mailOptions: nodemailer.SendMailOptions = {
      to: user.email,
      subject,
      html,
    };
    this.emailService.sendMail(mailOptions);
  }

  private getResetLink(resetToken: string, userId: string) {
    const resetLink = `${this.clientConfig.baseUrl}${this.clientConfig.passwordResetPath}`;
    const resetUrl = new URL(resetLink);
    resetUrl.searchParams.set('token', resetToken);
    resetUrl.searchParams.set('id', userId);

    return resetUrl.toString();
  }

  private async getRecoverPasswordHtml(user: User, resetLink: string) {
    return this.templatesService.compile('recover-password', {
      user,
      resetLink,
    });
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

  private async sendPasswordResetMail(user: User) {
    const html = await this.getPasswordResetHtml(user);
    const subject = 'Contraseña restablecida';
    const mailOptions: nodemailer.SendMailOptions = {
      to: user.email,
      subject,
      html,
    };
    this.emailService.sendMail(mailOptions);
  }

  private async getPasswordResetHtml(user: User) {
    return this.templatesService.compile('reset-password', {
      user,
    });
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
