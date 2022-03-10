import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TechType } from 'src/professional-profiles/enums/tech-type.enum';
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
    this.initLanguages();
    this.initDatabases();
    this.initFrameworks();
    this.initLibraries();
    this.initParadigms();
    this.initPatterns();
    this.initTools();
  }

  async initLanguages() {
    const type = TechType.Language;
    const collections = await this.findAll(type);
    if (collections.length) {
      return this.logger.debug('Ya existen lenguajes, inicialización omitida');
    }
    Object.entries(languages).forEach(([key, values]) => {
      const dto: CreateTechnologyDto = {
        type,
        dictionary: { name: key, identifiers: values },
      };
      this.create(dto);
    });
    this.logger.debug('Lenguajes inicializadas');
  }

  async initDatabases() {
    const type = TechType.Database;
    const collections = await this.findAll(type);
    if (collections.length) {
      return this.logger.debug(
        'Ya existen bases de datos, inicialización omitida',
      );
    }
    Object.entries(databases).forEach(([key, values]) => {
      const dto: CreateTechnologyDto = {
        type,
        dictionary: { name: key, identifiers: values },
      };
      this.create(dto);
    });
    this.logger.debug('Bases de datos inicializadas');
  }

  async initFrameworks() {
    const type = TechType.Framework;
    const collections = await this.findAll(type);
    if (collections.length) {
      return this.logger.debug('Ya existen frameworks, inicialización omitida');
    }
    Object.entries(frameworks).forEach(([key, values]) => {
      const dto: CreateTechnologyDto = {
        type,
        dictionary: { name: key, identifiers: values },
      };
      this.create(dto);
    });
    this.logger.debug('Frameworks inicializadas');
  }

  async initLibraries() {
    const type = TechType.Library;
    const collections = await this.findAll(type);
    if (collections.length) {
      return this.logger.debug('Ya existen librerías, inicialización omitida');
    }
    Object.entries(frameworks).forEach(([key, values]) => {
      const dto: CreateTechnologyDto = {
        type,
        dictionary: { name: key, identifiers: values },
      };
      this.create(dto);
    });
    this.logger.debug('Librerías inicializadas');
  }

  async initParadigms() {
    const type = TechType.Paradigm;
    const collections = await this.findAll(type);
    if (collections.length) {
      return this.logger.debug('Ya existen paradigmas, inicialización omitida');
    }
    Object.entries(frameworks).forEach(([key, values]) => {
      const dto: CreateTechnologyDto = {
        type,
        dictionary: { name: key, identifiers: values },
      };
      this.create(dto);
    });
    this.logger.debug('Paradigmas inicializadas');
  }

  async initPatterns() {
    const type = TechType.Pattern;
    const collections = await this.findAll(type);
    if (collections.length) {
      return this.logger.debug('Ya existen patrones, inicialización omitida');
    }
    Object.entries(frameworks).forEach(([key, values]) => {
      const dto: CreateTechnologyDto = {
        type,
        dictionary: { name: key, identifiers: values },
      };
      this.create(dto);
    });
    this.logger.debug('Patrones inicializadas');
  }

  async initTools() {
    const type = TechType.Tool;
    const collections = await this.findAll(type);
    if (collections.length) {
      return this.logger.debug(
        'Ya existen herramientas, inicialización omitida',
      );
    }
    Object.entries(frameworks).forEach(([key, values]) => {
      const dto: CreateTechnologyDto = {
        type,
        dictionary: { name: key, identifiers: values },
      };
      this.create(dto);
    });
    this.logger.debug('Herramientas inicializadas');
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
