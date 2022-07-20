import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailConfig } from '../../config/email.config';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly config: EmailConfig =
    this.configService.get<EmailConfig>('email');
  private readonly account = this.config.account;

  constructor(private readonly configService: ConfigService) {}

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
