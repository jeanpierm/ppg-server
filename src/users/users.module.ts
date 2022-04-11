import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersMapper } from './mapper/users.mapper';
import { User, UserSchema } from './schemas/users.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { IsRegisteredEmailValidator } from './validators/is-registered-email.validator';
import { IsRegisteredValidator } from './validators/is-registered.validator';
import { IsUnregisteredEmailValidator } from './validators/is-unregistered-email.validator';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersMapper,
    IsUnregisteredEmailValidator,
    IsRegisteredEmailValidator,
    IsRegisteredValidator,
  ],
  exports: [UsersService, IsUnregisteredEmailValidator],
})
export class UsersModule {}
