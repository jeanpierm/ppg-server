import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/users/schemas/users.schema';
import * as mongoose from 'mongoose';

export type ProProfileDocument = ProfesionalProfile & Document;

@Schema({ timestamps: true, versionKey: false })
export class ProfesionalProfile {
  @Prop({
    required: true,
    type: [String],
  })
  languages: string[];

  @Prop({ default: new Date() })
  consultationDate?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;
}

export const ProProfileSchema =
  SchemaFactory.createForClass(ProfesionalProfile);
