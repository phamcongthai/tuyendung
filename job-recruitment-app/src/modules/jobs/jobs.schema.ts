import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type JobsDocument = Jobs & Document;

export enum JobsStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true })
export class Jobs {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  description: string;

  @Prop()
  requirements: string;

  @Prop()
  benefits: string;

  @Prop()
  quantity: number;

  @Prop()
  salaryMin: number;

  @Prop()
  salaryMax: number;

  @Prop()
  salaryType: string;

  @Prop({ default: false })
  salaryNegotiable: boolean;

  @Prop()
  career: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'JobCategories' })
  categoryId: MongooseSchema.Types.ObjectId;

  @Prop()
  level: string;

  @Prop()
  jobType: string;

  @Prop()
  location: string;

  @Prop()
  address: string;

  @Prop()
  deadline: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ enum: JobsStatus, default: JobsStatus.ACTIVE })
  status: JobsStatus;

  @Prop()
  reasonReject: string;

  @Prop({ default: 0 })
  views: number;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Recruiter' })
  recruiterId: MongooseSchema.Types.ObjectId;

  @Prop({ default: false })
  deleted: boolean;  // Thêm trường deleted để soft delete
}

export const JobsSchema = SchemaFactory.createForClass(Jobs);
