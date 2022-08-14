import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { randomUUID } from 'crypto';
import * as mongoose from 'mongoose';

export type LogDocument = Log & mongoose.Document;

@Schema({ versionKey: false })
export class Log {
  _id: mongoose.Types.ObjectId;

  @Prop({
    index: { unique: true },
    default: () => randomUUID(),
  })
  logId: string;

  @Prop({
    required: true,
  })
  level: string;

  @Prop({
    required: true,
  })
  timestamp: Date;

  @Prop({
    required: true,
  })
  statusCode: number;

  @Prop({
    required: false,
  })
  message?: string;

  @Prop({
    required: false,
  })
  exception?: string;

  @Prop({
    required: true,
  })
  httpMethod: string;

  @Prop({
    required: true,
  })
  path: string;

  @Prop({
    required: false,
  })
  methodKey?: string;

  @Prop({
    required: false,
  })
  className?: string;

  @Prop({
    required: true,
  })
  ip: string;

  @Prop({
    required: true,
  })
  hostname: string;

  @Prop({
    required: true,
  })
  userId: string;

  @Prop({
    default: () => 'PPG',
  })
  applicationName: string;
}

export const LogSchema = SchemaFactory.createForClass(Log);
