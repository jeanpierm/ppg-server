import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Technology,
  TechnologyName,
  TechnologySchema,
} from '../technologies/schemas/technology.schema';
import {
  TechType,
  TechTypeName,
  TechTypeSchema,
} from './schemas/tech-type.schema';
import { TechTypesController } from './tech-types.controller';
import { TechTypesService } from './tech-types.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TechType.name,
        schema: TechTypeSchema,
        collection: TechTypeName,
      },
      {
        name: Technology.name,
        schema: TechnologySchema,
        collection: TechnologyName,
      },
    ]),
  ],
  controllers: [TechTypesController],
  providers: [TechTypesService],
  exports: [TechTypesService],
})
export class TechTypesModule {}
