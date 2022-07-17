import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { EntityStatus } from '../../shared/enums/status.enum';

export type TechTypeDocument = TechType & Document;
@Schema({
  timestamps: true,
  versionKey: false,
})
export class TechType {
  _id: Types.ObjectId;

  @Prop({ required: true, index: { unique: true } })
  name: string;

  @Prop({ required: true })
  label: string;

  @Prop({
    default: EntityStatus.Active,
    type: String,
    enum: EntityStatus,
  })
  status: EntityStatus;

  createdAt: Date;

  updatedAt: Date;
}

export const TechTypeSchema = SchemaFactory.createForClass(TechType);

export const TechTypeName = 'techTypes';
