import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

const base = '/admin/banners';

export interface BannerItem {
  _id: string;
  title: string;
  imageUrl: string;
  redirectUrl?: string;
  altText?: string;
  position: string;
  price: number;
  approved: boolean;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  viewCount?: number;
  clickCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const bannersAPI = {
  async list(page = 1, limit = 20) {
    const res = await axiosInstance.get(`${base}?page=${page}&limit=${limit}`);
    return res.data as { data: BannerItem[]; total: number };
  },
  async detail(id: string) {
    const res = await axiosInstance.get(`${base}/${id}`);
    return res.data as BannerItem;
  },
  async update(id: string, payload: Partial<BannerItem>) {
    const res = await axiosInstance.patch(`${base}/${id}`, payload);
    return res.data as { message: string; data: BannerItem };
  },
  async remove(id: string) {
    const res = await axiosInstance.delete(`${base}/${id}`);
    return res.data;
  },
};



