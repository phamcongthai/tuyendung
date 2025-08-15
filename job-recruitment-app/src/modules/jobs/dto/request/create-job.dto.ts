import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';
import { Types } from 'mongoose';
import { JobsStatus } from '../../jobs.schema';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  slug: string; // Thêm slug vì schema yêu cầu unique

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
  @IsBoolean()
  salaryNegotiable?: boolean;

  @IsOptional()
  @IsString()
  career?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

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
  deadline?: Date;

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
  recruiterId?: string; // ObjectId dạng string, nếu muốn validate chặt hơn có thể dùng custom validator

  @IsOptional()
  @IsBoolean()
  deleted?: boolean;
}
