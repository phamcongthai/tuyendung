import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecruiterDocument = Recruiter & Document;

export enum RecruiterStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true })
export class Recruiter {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: false })
  province: string;

  @Prop({ required: false })
  district: string;

  @Prop({
    type: String,
    enum: RecruiterStatus,
    default: RecruiterStatus.ACTIVE,
  })
  status: RecruiterStatus;

  @Prop({ default: null })
  avatar: string; 
  @Prop({ default: false})
  deleted: boolean;
}
export const RecruiterSchema = SchemaFactory.createForClass(Recruiter);
