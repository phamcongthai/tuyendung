import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

const base = '/admin/banner-packages';

export interface BannerPackagePayload {
  name: string;
  description?: string;
  position: 'BELOW_SEARCH_BAR' | 'BELOW_FEATURED_COMPANIES';
  previewImage?: string;
  durationDays: number;
  price: number;
  maxBannerSlots: number;
  priority?: number;
  isActive?: boolean;
}

export const bannerPackagesAPI = {
  async list(page = 1, limit = 20) {
    const res = await axiosInstance.get(`${base}?page=${page}&limit=${limit}`);
    return res.data;
  },
  async create(payload: BannerPackagePayload) {
    const res = await axiosInstance.post(base, payload);
    return res.data;
  },
  async detail(id: string) {
    const res = await axiosInstance.get(`${base}/${id}`);
    return res.data;
  },
  async update(id: string, payload: Partial<BannerPackagePayload>) {
    const res = await axiosInstance.patch(`${base}/${id}`, payload);
    return res.data;
  },
  async remove(id: string) {
    const res = await axiosInstance.delete(`${base}/${id}`);
    return res.data;
  },
};








