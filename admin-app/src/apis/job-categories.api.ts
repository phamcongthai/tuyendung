import axios from 'axios';
import type { JobCategoryData, CreateJobCategoryPayload } from '../types/job-categories.type';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

export const fetchJobCategories = async ({
  page = 1,
  limit = 10,
  search = '',
  status,
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive';
}): Promise<{ data: JobCategoryData[]; total: number }> => {
  const res = await axiosInstance.get<{ data: JobCategoryData[]; total: number }>(
    '/admin/job-categories',
    { params: { page, limit, search, status } }
  );
  return res.data;
};

export const createJobCategory = async (
  payload: CreateJobCategoryPayload
): Promise<JobCategoryData> => {
  const res = await axiosInstance.post<JobCategoryData>('/admin/job-categories', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};

export const fetchJobCategoryById = async (id: string): Promise<JobCategoryData> => {
  const res = await axiosInstance.get<JobCategoryData>(`/admin/job-categories/detail/${id}`);
  return res.data;
};

export const editJobCategory = async (
  id: string,
  payload: Partial<CreateJobCategoryPayload>
): Promise<JobCategoryData> => {
  const res = await axiosInstance.patch<JobCategoryData>(`/admin/job-categories/${id}`, payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};

export const deleteJobCategory = async (id: string) => {
  const res = await axiosInstance.patch<{ message: string }>(`/admin/job-categories/delete/${id}`);
  return res.data;
};

export const toggleJobCategoryStatus = async (id: string): Promise<JobCategoryData> => {
  const res = await axiosInstance.patch<JobCategoryData>(`/admin/job-categories/toggle-status/${id}`);
  return res.data;
};


