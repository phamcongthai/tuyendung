// types/jobs.type.ts
import { JobsStatus } from './jobs.enum';

export interface JobData {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  quantity?: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: string;
  salaryNegotiable?: boolean;
  career?: string;
  categoryId?: string; 
  level?: string;
  jobType?: string;
  location?: string;
  address?: string;
  deadline?: string; 
  isActive: boolean;
  status: JobsStatus;
  reasonReject?: string;
  views: number;
  skills: string[];
  tags: string[];
  images?: string[];
  recruiterId?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateJobPayload = Omit<
  JobData,
  '_id' | 'createdAt' | 'updatedAt' | 'views' | 'images' | 'slug'
>;
