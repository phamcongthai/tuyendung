export interface JobCategoryData {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  status: 'active' | 'inactive';
  views?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateJobCategoryPayload = Omit<JobCategoryData, '_id' | 'slug' | 'views' | 'createdAt' | 'updatedAt'>;


