import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { TechType } from 'src/professional-profiles/enums/tech-type.enum';
import { PaginationParams } from '../shared/dto/pagination-params.dto';
import { PaginationDto } from '../shared/dto/pagination.dto';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { Technology, TechnologyDocument } from './schemas/technology.schema';
@Injectable()
export class TechnologiesService {
  private readonly logger = new Logger(TechnologiesService.name);

  constructor(
    @InjectModel(Technology.name)
    private readonly technologyModel: Model<TechnologyDocument>,
  ) {
    this.init();
  }

  async init() {
    const jsonPath = __dirname + '/../../collections/technologies.json';
    const hasTechnologies = !!(
      await this.technologyModel.find().limit(1).lean()
    ).length;
    this.logger.debug(`Existen tecnologías guardadas: ${hasTechnologies}`);
    const hasJsonCollection = fs.existsSync(jsonPath);
    this.logger.debug(
      `Existe archivo "technologies.json": ${hasJsonCollection}`,
    );
    if (hasTechnologies || !hasJsonCollection) {
      this.logger.debug('Carga de JSON a MongoDB omitida');
      return;
    }
    try {
      this.logger.debug(
        'Iniciando carga de tecnologías a MongoDB desde JSON...',
      );
      const technologiesJson = fs.readFileSync(jsonPath, 'utf-8');
      this.logger.debug('Tecnologías obtenidas de JSON exitosamente');
      const technologies = JSON.parse(technologiesJson);
      await this.technologyModel.insertMany(technologies);
      this.logger.debug(
        'Tecnologías cargadas a MongoDB desde JSON exitosamente',
      );
    } catch (err) {
      if (err instanceof Error) {
        this.logger.warn(
          `Ocurrió un error y no se pudo cargar tecnologías desde JSON: ${err.message}`,
        );
        console.error(err);
      }
    }
  }

  async findAll(
    pagination: PaginationParams,
    type?: TechType,
  ): Promise<PaginationDto<Technology>> {
    const { size, search, page } = pagination;
    const filterQuery: Record<string, any> = {};

    if (search) {
      filterQuery['$or'] = [
        { name: new RegExp(search, 'i') },
        { identifiers: new RegExp(search, 'i') },
      ];
    }

    if (type) filterQuery.type = type;

    const technologies = await this.technologyModel
      .find(filterQuery)
      .sort({ _id: 1 })
      .skip((page - 1) * size)
      .limit(size)
      .lean();

    const totalItems = await this.technologyModel.count(filterQuery);
    const totalPages = Math.ceil(totalItems / size);

    return {
      totalItems,
      currentPage: page,
      pageSize: size,
      data: technologies,
      totalPages,
    };
  }

  async findById(id: string): Promise<TechnologyDocument> {
    return this.technologyModel.findOne({ technologyId: id }).lean();
  }

  async findByType(type: TechType): Promise<TechnologyDocument[]> {
    return this.technologyModel.find({ type }).lean();
  }

  async create(
    createTechnologyDto: CreateTechnologyDto,
  ): Promise<TechnologyDocument> {
    return this.technologyModel.create(createTechnologyDto);
  }

  async update(
    id: string,
    updateTechnologyDto: UpdateTechnologyDto,
  ): Promise<void> {
    await this.technologyModel
      .updateOne({ technologyId: id }, updateTechnologyDto, { new: true })
      .lean();
  }

  async remove(id: string): Promise<void> {
    await this.technologyModel.deleteOne({ technologyId: id }).lean();
  }
}
