import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

const base = '/admin/job-packages';

export interface JobPackagePayload {
  packageName: string;
  price: number;
  durationDays: number;
  features?: {
    jobPostLimit?: number;
    autoApprove?: boolean;
    highlight?: boolean;
    showOnHomepage?: boolean;
    analyticsAccess?: boolean;
    supportLevel?: 'none' | 'email' | 'hotline' | 'priority';
  };
  priorityLevel?: number;
  isActive?: boolean;
}

export const jobPackagesAPI = {
  async list(page = 1, limit = 20) {
    const res = await axiosInstance.get(`${base}?page=${page}&limit=${limit}`);
    return res.data;
  },
  async create(payload: JobPackagePayload) {
    const res = await axiosInstance.post(base, payload);
    return res.data;
  },
  async detail(id: string) {
    const res = await axiosInstance.get(`${base}/${id}`);
    return res.data;
  },
  async update(id: string, payload: Partial<JobPackagePayload>) {
    const res = await axiosInstance.patch(`${base}/${id}`, payload);
    return res.data;
  },
  async remove(id: string) {
    const res = await axiosInstance.delete(`${base}/${id}`);
    return res.data;
  },
};


