import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Technology,
  TechnologyDocument,
} from '../technologies/schemas/technology.schema';
import { CreateTechTypeDto } from './dto/create-tech-type.dto';
import { UpdateTechTypeDto } from './dto/update-tech-type.dto';
import { TechType, TechTypeDocument } from './schemas/tech-type.schema';
import { TechTypeErrors } from './tech-types.errors';

@Injectable()
export class TechTypesService {
  private readonly logger = new Logger(TechTypesService.name);

  constructor(
    @InjectModel(TechType.name)
    private readonly techTypeModel: Model<TechTypeDocument>,
    @InjectModel(Technology.name)
    private readonly technologyModel: Model<TechnologyDocument>,
  ) {}

  async findAll() {
    const techTypes = await this.techTypeModel.find({});
    return techTypes;
  }

  /**
   * @throws {NotFoundException} if no document found
   */
  async findById(id: string) {
    const techType = await this.techTypeModel
      .findById(id)
      .orFail(new NotFoundException(TechTypeErrors.notFound(id)));
    return techType;
  }

  /**
   * @throws {NotFoundException} if no document found
   */
  async findByName(name: string) {
    const techType = await this.techTypeModel
      .findOne({ name })
      .orFail(new NotFoundException(TechTypeErrors.notFound(name)));
    return techType;
  }

  /**
   * @throws {ConflictException} if no document found
   */
  async create(createTechTypeDto: CreateTechTypeDto) {
    const isNameRegistered = await this.techTypeModel.exists({
      name: createTechTypeDto.name,
    });
    if (isNameRegistered) {
      throw new ConflictException(
        TechTypeErrors.nameAlreadyExists(createTechTypeDto.name),
      );
    }

    const techType = await this.techTypeModel.create(createTechTypeDto);
    return techType;
  }

  async insertMany(createTechTypeDtos: CreateTechTypeDto[]) {
    return this.techTypeModel.insertMany(createTechTypeDtos);
  }

  /**
   * @throws {NotFoundException} if no document found
   */
  async update(id: string, updateTechTypeDto: UpdateTechTypeDto) {
    const techType = await this.techTypeModel
      .findById(id)
      .orFail(new NotFoundException(TechTypeErrors.notFound(id)));
    console.log(techType);
    if (techType.name !== updateTechTypeDto.name) {
      const nameAlreadyExists = await this.techTypeModel.exists({
        name: updateTechTypeDto.name,
      });
      if (nameAlreadyExists)
        throw new ConflictException(
          TechTypeErrors.nameAlreadyExists(updateTechTypeDto.name),
        );
    }
    await this.techTypeModel
      .updateOne({ id }, updateTechTypeDto)
      .orFail(new NotFoundException(TechTypeErrors.notFound(id)));
  }

  /**
   * @throws {NotFoundException} if no document found
   */
  async remove(id: string) {
    // TODO: hacerlo por hook?
    await this.technologyModel.remove({ type: id });

    const res = await this.techTypeModel
      .deleteOne({ id })
      .orFail(new NotFoundException(TechTypeErrors.notFound(id)));
    this.logger.warn(`Technology Type with ID "${id}" removed`, res);
  }
}
