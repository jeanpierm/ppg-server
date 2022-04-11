import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TechType } from 'src/professional-profiles/enums/tech-type.enum';
import { libraries } from '../professional-profiles/identifiers/libraries';
import { paradigms } from '../professional-profiles/identifiers/paradigms';
import { patterns } from '../professional-profiles/identifiers/patterns';
import { tools } from '../professional-profiles/identifiers/tools';
import { CreateTechnologyDto } from './dto/create-technology.dto';
import { UpdateTechnologyDto } from './dto/update-technology.dto';
import { Technology, TechnologyDocument } from './schemas/technology.schema';
import { databases } from './utils/dictionaries/databases';
import { frameworks } from './utils/dictionaries/frameworks';
import { languages } from './utils/dictionaries/languages';

@Injectable()
export class TechnologiesService {
  private readonly logger = new Logger(TechnologiesService.name);

  constructor(
    @InjectModel(Technology.name)
    private readonly technologyModel: Model<TechnologyDocument>,
  ) {
    Object.values(TechType).forEach((type) => {
      this.initTechnology(type);
    });
  }

  async initTechnology(type: TechType) {
    const collections = await this.findAll(type);
    if (collections && collections.length) {
      return this.logger.debug(`Ya existen ${type}, inicialización omitida.`);
    }
    let technologies: Record<string, string[]>;
    switch (type) {
      case TechType.Language:
        technologies = languages;
        break;
      case TechType.Database:
        technologies = databases;
        break;
      case TechType.Framework:
        technologies = frameworks;
        break;
      case TechType.Library:
        technologies = libraries;
        break;
      case TechType.Paradigm:
        technologies = paradigms;
        break;
      case TechType.Pattern:
        technologies = patterns;
        break;
      case TechType.Tool:
        technologies = tools;
        break;
      default:
        break;
    }
    Object.entries(technologies).forEach(([key, values]) => {
      const dto: CreateTechnologyDto = {
        type,
        name: key,
        identifiers: values,
      };
      this.create(dto);
    });
    this.logger.debug(`tecnologías de tipo ${type} inicializadas`);
  }

  async findAll(type?: TechType): Promise<TechnologyDocument[]> {
    if (type) {
      return this.findByType(type);
    }
    return this.technologyModel.find().lean();
  }

  async findById(id: string): Promise<TechnologyDocument> {
    return this.technologyModel.findOne({ technologyId: id }).lean();
  }

  async findByType(type: TechType): Promise<TechnologyDocument[]> {
    return this.technologyModel.find({ type }).lean();
  }

  async create(createTechnologyDto: CreateTechnologyDto): Promise<TechnologyDocument> {
    return this.technologyModel.create(createTechnologyDto);
  }

  async update(id: string, updateTechnologyDto: UpdateTechnologyDto): Promise<void> {
    await this.technologyModel
      .updateOne({ technologyId: id }, updateTechnologyDto, { new: true })
      .lean();
  }

  async remove(id: string): Promise<void> {
    await this.technologyModel.deleteOne({ technologyId: id }).lean();
  }
}
