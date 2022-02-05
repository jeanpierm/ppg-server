import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schema';
import { IsUnregisteredEmailValidator } from './validators/is-unregistered-email.validator';
import { IsRegisteredEmailValidator } from './validators/is-registered-email.validator';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    IsUnregisteredEmailValidator,
    IsRegisteredEmailValidator,
  ],
  exports: [UsersService],
})
export class UsersModule {}
