import axios from 'axios';
import type { JobData, CreateJobPayload, UpdateJobPayload } from '../types/jobs.type';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

// Lấy danh sách jobs
export const fetchJobs = async ({
  page = 1,
  limit = 10,
  search = '',
  status,
  jobType,
  workingMode,
  jobCategoryId,
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive';
  jobType?: string;
  workingMode?: string;
  jobCategoryId?: string;
}) => {
  const res = await axiosInstance.get<{ data: JobData[]; total: number }>('/admin/jobs', {
    params: { page, limit, search, status, jobType, workingMode, jobCategoryId },
  });
  return res.data;
};

// Tạo job mới
export const createJob = async (job: CreateJobPayload) => {
  const res = await axiosInstance.post<{ message: string; job: JobData }>('/admin/jobs', job);
  return res.data;
};

// Cập nhật job
export const updateJob = async (id: string, job: UpdateJobPayload, files?: File[]) => {
  const formData = new FormData();
  
  // Append job data
  Object.keys(job).forEach(key => {
    if (job[key] !== undefined && job[key] !== null) {
      if (key === 'skills' && Array.isArray(job[key])) {
        // Handle skills array
        job[key].forEach((skill: string) => {
          formData.append('skills[]', skill);
        });
      } else if (key === 'tags' && Array.isArray(job[key])) {
        // Handle tags array
        job[key].forEach((tag: string) => {
          formData.append('tags[]', tag);
        });
      } else {
        formData.append(key, job[key]);
      }
    }
  });
  
  // Append files if provided
  if (files && files.length > 0) {
    files.forEach(file => {
      formData.append('files', file);
    });
  }
  
  const res = await axiosInstance.patch<{ message: string; job: JobData }>(`/admin/jobs/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// Lấy chi tiết job
export const fetchJobById = async (id: string) => {
  const res = await axiosInstance.get<JobData>(`/admin/jobs/${id}`);
  return res.data;
};

// Xóa job (soft delete)
export const deleteJob = async (id: string) => {
  const res = await axiosInstance.patch<{ message: string }>(`/admin/jobs/delete/${id}`);
  return res.data;
};

// Toggle job status
export const toggleJobStatus = async (id: string) => {
  const res = await axiosInstance.patch<{ message: string; job: JobData }>(`/admin/jobs/toggle-status/${id}`);
  return res.data;
};
