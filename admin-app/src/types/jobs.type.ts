// types/jobs.type.ts
import { JobsStatus } from './jobs.enum';

export interface JobData {
  _id: string;
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  skills: string[];
  tags?: string[];
  jobType: string;
  workingMode: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryType?: string;
  salaryNegotiable?: boolean;
  currency: string;
  deadline?: string;
  isActive: boolean;
  deleted?: boolean;
  recruiterId: string;
  companyId: string;
  jobCategoryId?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  // Populated fields from backend
  recruiter?: {
    _id: string;
    fullName: string;
    email: string;
  };
  company?: {
    _id: string;
    name: string;
  };
  jobCategory?: {
    _id: string;
    title: string;
    slug: string;
    description?: string;
  };
}

export type CreateJobPayload = Omit<
  JobData,
  '_id' | 'createdAt' | 'updatedAt' | 'recruiter' | 'company' | 'jobCategory'
>;

export type UpdateJobPayload = Partial<CreateJobPayload>;
