import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs/promises';
import { Model } from 'mongoose';
import * as path from 'path';
import { PaginatedResponseDto } from '../shared/dto/paginated-response.dto';
import { PaginationParams } from '../shared/dto/pagination-params.dto';
import { CreateTechTypeDto } from '../tech-types/dto/create-tech-type.dto';
import { TechTypesService } from '../tech-types/tech-types.service';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { Technology, TechnologyDocument } from './schemas/technology.schema';
@Injectable()
export class TechnologiesService {
  private readonly logger = new Logger(TechnologiesService.name);
  private readonly technologiesJsonPath = path.join(
    process.cwd(),
    'collections',
    'technologies.json',
  );
  private readonly techTypesJsonPath = path.join(
    process.cwd(),
    'collections',
    'technologies-types.json',
  );

  constructor(
    @InjectModel(Technology.name)
    private readonly technologyModel: Model<TechnologyDocument>,
    private readonly typesService: TechTypesService,
  ) {
    this.technologyModel
      .find()
      .limit(1)
      .lean()
      .then((technologies) => {
        const hasTechnologies = technologies.length > 0;
        if (hasTechnologies) {
          this.logger.debug(
            'Carga de tecnologías a MongoDB omitida debido a que ya existen tecnologías registradas.',
          );
          return;
        }
        this.insertBaseTechTypes().then(() => {
          this.insertBaseTechnologies();
        });
      });
  }

  private async insertBaseTechTypes(): Promise<void> {
    try {
      const techTypesJson: string = (
        await fs.readFile(this.techTypesJsonPath, 'utf-8')
      ).toString();
      const techTypes = JSON.parse(techTypesJson) as CreateTechTypeDto[];
      await this.typesService.insertMany(techTypes);
      this.logger.debug(
        'Tipos de tecnologías cargadas a MongoDB desde JSON exitosamente',
      );
    } catch (err) {
      if (err instanceof Error) {
        this.logger.warn(
          `Ocurrió un error y no se pudo cargar los tipos de tecnologías desde JSON: ${err.message}`,
        );
        console.error(err);
      }
    }
  }

  private async insertBaseTechnologies(): Promise<void> {
    try {
      this.logger.debug(
        'Iniciando carga de tecnologías a MongoDB desde JSON...',
      );

      // technologies
      const technologiesJson: string = (
        await fs.readFile(this.technologiesJsonPath, 'utf-8')
      ).toString();
      const createTechnologies = JSON.parse(
        technologiesJson,
      ) as CreateTechnologyDto[];
      const technologies = await Promise.all(
        createTechnologies.map(async (technology) => ({
          ...technology,
          type: await this.typesService.findByName(technology.type),
        })),
      );
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
    pagination?: PaginationParams,
    typeName?: string,
  ): Promise<PaginatedResponseDto<Technology>> {
    const { size, search, page } = pagination || {};
    const filterQuery: Record<string, any> = {};

    if (search) {
      filterQuery['$or'] = [
        { name: new RegExp(search, 'i') },
        { identifiers: new RegExp(search, 'i') },
      ];
    }

    if (typeName) {
      const type = await this.typesService.findByName(typeName);
      filterQuery.type = type;
    }

    const technologies = await this.technologyModel
      .find(filterQuery)
      .populate('type')
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

  async findByName(name: string): Promise<TechnologyDocument> {
    const technologies = await this.technologyModel
      .findOne({ name })
      .populate('type')
      .orFail(
        new NotFoundException(`Technology with name ${name} doesn't exist.`),
      );
    return technologies;
  }

  async findByType(typeName: string): Promise<TechnologyDocument[]> {
    const type = await this.typesService.findByName(typeName);

    return this.technologyModel.find({ type }).populate('type').lean();
  }

  async create(
    createTechnologyDto: CreateTechnologyDto,
  ): Promise<TechnologyDocument> {
    const isNameRegistered = await this.technologyModel.exists({
      name: createTechnologyDto.name,
    });
    if (isNameRegistered) {
      throw new ConflictException(
        `Technology with name ${createTechnologyDto.name} already exists.`,
      );
    }

    const type = await this.typesService.findByName(createTechnologyDto.type);

    return (
      await this.technologyModel.create({ ...createTechnologyDto, type })
    ).populate({
      path: 'type',
    });
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
