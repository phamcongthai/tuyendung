import axios from 'axios';
import type { JobData, CreateJobPayload } from '../types/jobs.type';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Bỏ header Content-Type mặc định để tránh ghi đè khi gửi FormData
  // headers: { 'Content-Type': 'application/json' }, 
  withCredentials: true,
});

// Lấy danh sách jobs
export const fetchJobs = async ({
  page = 1,
  limit = 10,
  search = '',
  status,
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'inactive';
}) => {
  const res = await axiosInstance.get<{ data: JobData[]; total: number }>('/admin/jobs', {
    params: { page, limit, search, status },
  });
  return res.data;
};

// Tạo job (có thể kèm hoặc không kèm ảnh)
export const createJob = async (
  job: CreateJobPayload,
  files?: File[]
) => {
  try {
    if (files && files.length > 0) {
      const formData = new FormData();

      Object.entries(job).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => formData.append(key, v));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      files.forEach(file => {
        formData.append('files', file);
      });

      const res = await axiosInstance.post<JobData>('/admin/jobs', formData);
      return res.data;
    }

    // Nếu không có file thì gửi JSON bình thường
    const res = await axiosInstance.post<JobData>('/jobs', job, {
      headers: { 'Content-Type': 'application/json' }
    });
    return res.data;

  } catch (error: any) {
    console.error('createJob error:', error.response?.data || error.message || error);
    throw error;
  }
};

// Lấy chi tiết 1 job
export const fetchJobById = async (id: string) => {
  const res = await axiosInstance.get<JobData>(`/jobs/${id}`);
  return res.data;
};

// Cập nhật job (có thể kèm ảnh mới)
export const editJob = async (
  id: string,
  job: Partial<CreateJobPayload>,
  files?: File[]
) => {
  try {
    if (files && files.length > 0) {
      const formData = new FormData();

      Object.entries(job).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => formData.append(key, v));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      files.forEach(file => {
        formData.append('files', file);
      });

      const res = await axiosInstance.patch<JobData>(`/jobs/${id}`, formData);
      return res.data;
    }

    const res = await axiosInstance.patch<JobData>(`/jobs/${id}`, job, {
      headers: { 'Content-Type': 'application/json' }
    });
    return res.data;

  } catch (error: any) {
    console.error('editJob error:', error.response?.data || error.message || error);
    throw error;
  }
};

// Xóa job
export const deleteJob = async (id: string) => {
  const res = await axiosInstance.delete<{ message: string }>(`/jobs/${id}`);
  return res.data;
};

// Toggle trạng thái active/inactive
export const toggleJobStatus = async (id: string) => {
  const res = await axiosInstance.patch<JobData>(`/jobs/toggle-status/${id}`);
  return res.data;
};
