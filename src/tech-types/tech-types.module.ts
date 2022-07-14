import { Module } from '@nestjs/common';
import { TechTypesService } from './tech-types.service';
import { TechTypesController } from './tech-types.controller';

@Module({
  controllers: [TechTypesController],
  providers: [TechTypesService]
})
export class TechTypesModule {}
