import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TechTypesModule } from '../tech-types/tech-types.module';
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
    TechTypesModule,
  ],
  controllers: [TechnologiesController],
  providers: [TechnologiesService],
  exports: [TechnologiesService],
})
export class TechnologiesModule {}
