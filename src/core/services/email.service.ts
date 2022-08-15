import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { ClientConfig } from '../../config/client.config';
import { EmailConfig } from '../../config/email.config';
import { User } from '../../users/schemas/user.schema';
import { SendRecoverPasswordMailData } from '../interfaces/send-recover-password-mail-data.interface';
import { TemplatesService } from './templates.service';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly config: EmailConfig =
    this.configService.get<EmailConfig>('email');
  private readonly account = this.config.account;
  private readonly clientConfig =
    this.configService.get<ClientConfig>('client');

  constructor(
    private readonly configService: ConfigService,
    private readonly templatesService: TemplatesService,
  ) {}

  async sendRecoverPasswordMail({
    user,
    resetToken,
    host,
  }: SendRecoverPasswordMailData) {
    const resetLink = this.getResetLink({
      resetToken,
      userId: user._id.toHexString(),
      host,
    });
    const html = await this.getRecoverPasswordHtml(user, resetLink);
    const subject = 'Recupera tu contraseña';
    const mailOptions: nodemailer.SendMailOptions = {
      to: user.email,
      subject,
      html,
    };
    this.sendMail(mailOptions);
  }

  private getResetLink({ resetToken, userId, host }) {
    const protocol = 'http';
    const clientHost = this.clientConfig.host || host;
    const resetPath = this.clientConfig.passwordResetPath;
    const resetLink = `${protocol}://${clientHost}${resetPath}`;
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

  async sendMail(mailOptions: nodemailer.SendMailOptions) {
    try {
      const transporter = nodemailer.createTransport(
        {
          service: this.config.service,
          auth: {
            user: this.account.user,
            pass: this.account.pass,
          },
        },
        { from: `PPG <${this.account.user}>` },
      );
      const info = await transporter.sendMail(mailOptions);
      this.logger.log(
        `Email sent successfully with messageId "${info.messageId}"`,
      );
    } catch (err) {
      this.logger.error(err.message, err.stack);
    }
  }
}
