import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatedResponseDto } from '../shared/dto/paginated-response.dto';
import { PaginationParams } from '../shared/dto/pagination-params.dto';
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

  async findAll(
    pagination?: PaginationParams,
  ): Promise<PaginatedResponseDto<TechType>> {
    const { size, search, page } = pagination || {};
    const filterQuery: Record<string, any> = {};

    if (search) {
      filterQuery['$or'] = [
        { name: new RegExp(search, 'i') },
        { label: new RegExp(search, 'i') },
      ];
    }

    const techTypes = await this.techTypeModel
      .find(filterQuery)
      .sort({ _id: 1 })
      .skip((page - 1) * size)
      .limit(size)
      .lean();

    const totalItems = await this.techTypeModel.count(filterQuery);
    const totalPages = Math.ceil(totalItems / size);

    return {
      totalItems,
      currentPage: page,
      pageSize: size,
      data: techTypes,
      totalPages,
    };
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
      .updateOne({ _id: id }, updateTechTypeDto)
      .orFail(new NotFoundException(TechTypeErrors.notFound(id)));
  }

  /**
   * @throws {NotFoundException} if no document found
   */
  async remove(id: string) {
    // TODO: hacerlo por hook?
    // elimina las tecnologías que tienen referido el techType (como cascada), para evitar errores de referencia
    await this.technologyModel.deleteMany({ type: id });

    const res = await this.techTypeModel
      .deleteOne({ _id: id })
      .orFail(new NotFoundException(TechTypeErrors.notFound(id)));
    this.logger.warn(`Technology Type with ID "${id}" removed`, res);
  }

  async removeAll() {
    await this.technologyModel.deleteMany({});
  }
}
