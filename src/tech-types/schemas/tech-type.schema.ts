import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TechTypeDocument = TechType & Document;
@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.id;
    },
  },
})
export class TechType {
  // _id: Types.ObjectId;
  @Prop({ required: true, index: { unique: true } })
  name: string;

  @Prop({ required: true })
  label: string;
}

export const TechTypeSchema = SchemaFactory.createForClass(TechType);
TechTypeSchema.virtual('techTypeId').get(function () {
  return this._id.toHexString();
});

export const TechTypeName = 'techTypes';
