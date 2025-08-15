export type Company = {
  id: string
  name: string
  logoText?: string
  hot?: boolean
  location?: string
}

export type JobData = {
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
  skills: string[];
  tags: string[];
  images?: string[];
  recruiterId?: string;
  createdAt: string;
  updatedAt: string;
}

export type JobCategory = {
  id: string
  name: string
  count: number
}


