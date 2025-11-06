import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

export interface BannerOrderItem {
  _id: string;
  packageId: string;
  accountId: string;
  recruiterId: string;
  companyId: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  title: string;
  imageUrl: string;
  redirectUrl?: string;
  altText?: string;
  bannerId?: string | null;
  createdAt?: string;
}

export const bannerOrdersAPI = {
  async list(params: { page?: number; limit?: number; packageId?: string; status?: string } = {}) {
    const res = await axiosInstance.get('/admin/banner-orders', { params });
    return res.data as { data: BannerOrderItem[]; total: number };
  },
  async approve(id: string) {
    const res = await axiosInstance.post(`/admin/banner-orders/${id}/approve`);
    return res.data as { message: string; bannerId: string };
  },
};


