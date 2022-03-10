import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TechnologiesService } from './technologies.service';
import { TechnologiesController } from './technologies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Technology,
  TechnologyName,
  TechnologySchema,
} from './schemas/technology.schema';
import { ValidateTechnologyExistsMiddleware } from './middlewares/validate-technology-exists.middleware';
import { TechnologiesMapper } from './mappers/technologies.mapper';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Technology.name,
        schema: TechnologySchema,
        collection: TechnologyName,
      },
    ]),
  ],
  controllers: [TechnologiesController],
  providers: [TechnologiesService, TechnologiesMapper],
  exports: [TechnologiesService, TechnologiesMapper],
})
export class TechnologiesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateTechnologyExistsMiddleware).forRoutes({
      path: 'technologies/:technologyId',
      method: RequestMethod.GET,
    });
  }
}
