import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Company } from '../dto/company.dto';
import { JobIntf } from '../interfaces/job.interface';
import { WorkPlace } from '../types/workplace.type';

export type JobDocument = Job & Document;

@Schema({ timestamps: true, versionKey: false })
export class Job implements JobIntf {
  @Prop()
  title: string;

  @Prop()
  detail: string;

  @Prop({ type: Company })
  company: Company;

  @Prop()
  location: string;

  @Prop({ type: String })
  workplaceType?: WorkPlace;

  @Prop()
  url: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);
