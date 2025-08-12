import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  IsBoolean,
  IsArray,
  ArrayUnique,
} from 'class-validator';
import { JobsStatus } from '../jobs.schema';

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  benefits?: string;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  salaryMin?: number;

  @IsOptional()
  @IsNumber()
  salaryMax?: number;

  @IsOptional()
  @IsString()
  salaryType?: string;

  @IsOptional()
  @IsString()
  career?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  jobType?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string; // <-- sửa thành string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsEnum(JobsStatus)
  status?: JobsStatus;

  @IsOptional()
  @IsString()
  reasonReject?: string;

  @IsOptional()
  @IsNumber()
  views?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  skills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  tags?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsString()
  recruiterId?: string;

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
