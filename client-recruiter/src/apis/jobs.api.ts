import axios from 'axios';
import type { JobData } from '../types/models';

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
}: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const res = await axiosInstance.get<{ data: JobData[]; total: number }>('/admin/jobs', {
      params: { page, limit, search },
    });

    // Log chi tiết dữ liệu trả về
    console.log('📦 API Response /admin/jobs:', res);
    console.log('📊 Jobs data:', res.data.data);
    console.log('📈 Total jobs:', res.data.total);

    return res.data;
  } catch (error) {
    console.error('❌ Lỗi khi fetchJobs:', error);
    throw error;
  }
};
