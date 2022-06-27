import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Company } from '../dto/company.dto';
import { JobIntf } from '../interfaces/job.interface';
import { WorkPlace } from '../types/workplace.type';

export type JobDocument = Job & Document;

@Schema({ timestamps: true, versionKey: false })
export class Job implements JobIntf {
  @Prop({ trim: true })
  title: string;

  @Prop({ trim: true })
  detail: string;

  @Prop({ type: Company })
  company: Company;

  @Prop({ lowercase: true, trim: true })
  location: string;

  @Prop({ type: String, lowercase: true, trim: true })
  workplaceType?: WorkPlace;

  @Prop()
  url: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);
