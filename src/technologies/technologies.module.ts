import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesScraper } from './coursesScraper/main';
import { ValidateTechnologyExistsMiddleware } from './middlewares/validate-technology-exists.middleware';
import {
  Technology,
  TechnologyName,
  TechnologySchema,
} from './schemas/technology.schema';
import { TechnologiesController } from './technologies.controller';
import { TechnologiesService } from './technologies.service';

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
  providers: [TechnologiesService, CoursesScraper],
  exports: [TechnologiesService],
})
export class TechnologiesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateTechnologyExistsMiddleware).forRoutes({
      path: 'technologies/:technologyId',
      method: RequestMethod.ALL,
    });
  }
}
