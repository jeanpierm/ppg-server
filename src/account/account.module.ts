import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [UsersModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
