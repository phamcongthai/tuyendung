import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecruiterDocument = Recruiter & Document;

@Schema({ timestamps: true })
export class Recruiter {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, enum: ['Nam', 'Nữ'] })
  gender: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  province: string;

  @Prop({ required: true })
  district: string;

  @Prop({ default: false })
  isVerified: boolean;
  
  @Prop({ default: null })
  avatar: string; 

  @Prop({ default: false})
  deleted: boolean;
}

export const RecruiterSchema = SchemaFactory.createForClass(Recruiter);
