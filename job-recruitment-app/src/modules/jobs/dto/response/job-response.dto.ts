import { Expose } from 'class-transformer';

export class JobResponseDto {
  @Expose()
  _id: string;

  @Expose()
  title: string;

  @Expose()
  slug: string;

  @Expose()
  description?: string;

  @Expose()
  requirements?: string;

  @Expose()
  benefits?: string;

  @Expose()
  quantity?: number;

  @Expose()
  salaryMin?: number;

  @Expose()
  salaryMax?: number;

  @Expose()
  salaryType?: string;

  @Expose()
  salaryNegotiable?: boolean;

  @Expose()
  career?: string;

  @Expose()
  categoryId?: string;

  @Expose()
  level?: string;

  @Expose()
  jobType?: string;

  @Expose()
  location?: string;

  @Expose()
  address?: string;

  @Expose()
  deadline?: Date;

  @Expose()
  skills: string[];

  @Expose()
  tags: string[];

  @Expose()
  images?: string[];

  @Expose()
  recruiterId?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
