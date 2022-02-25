import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type DatabasesDocument = Databases & mongoose.Document;

@Schema({ timestamps: true, versionKey: false })
export class Databases {
  @Prop({ required: true, trim: true })
  MySQL: number;

  @Prop({ required: true, trim: true })
  MariaDB: number;

  @Prop({ required: true, trim: true })
  Oracle: number;

  @Prop({ required: true, trim: true })
  PostgreSQL: number;

  @Prop({ required: true, trim: true })
  'Microsoft SQL Server': number;

  @Prop({ required: true, trim: true })
  SQLite: number;

  @Prop({ required: true, trim: true })
  MongoDB: number;

  @Prop({ required: true, trim: true })
  CouchDB: number;

  @Prop({ required: true, trim: true })
  Cassandra: number;

  @Prop({ required: true, trim: true })
  Redis: number;

  @Prop({ required: true, trim: true })
  Hadoop: number;

  @Prop({ required: true, trim: true })
  Riak: number;

  @Prop({ required: true, trim: true })
  Neo4j: number;
}

export const DatabasesSchema = SchemaFactory.createForClass(Databases);

export const DatabasesName = 'databasesMetadata';
