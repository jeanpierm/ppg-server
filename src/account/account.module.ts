import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { EmailService } from '../core/services/email.service';
import { TemplatesService } from '../core/services/templates.service';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { Token, TokenSchema } from './schemas/token.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  controllers: [AccountController],
  providers: [AccountService, EmailService, TemplatesService],
})
export class AccountModule {}
