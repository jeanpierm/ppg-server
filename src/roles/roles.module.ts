import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RoleCollectionName,
  RoleEntity,
  RoleSchema,
} from './schemas/role.schema';
import { ValidateRoleExistsMiddleware } from './middlewares/validate-role-exists.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RoleEntity.name,
        schema: RoleSchema,
        collection: RoleCollectionName,
      },
    ]),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateRoleExistsMiddleware).forRoutes({
      path: 'roles/:roleId',
      method: RequestMethod.ALL,
    });
  }
}
