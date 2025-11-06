import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
});

export type SiteSettings = {
  logoUrl?: string;
  faviconUrl?: string;
  clientTitle?: string;
  recruiterTitle?: string;
  noticeEnabled?: boolean;
  noticeMessage?: string;
  noticeColor?: string;
};

export const settingsApi = {
  getPublic: async (): Promise<SiteSettings> => {
    const res = await axiosInstance.get('/site-settings');
    return res.data as SiteSettings;
  },
  updateAdmin: async (payload: SiteSettings) => {
    const res = await axiosInstance.patch('/admin/site-settings', payload);
    return res.data as { message: string; data: SiteSettings };
  },
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axiosInstance.post('/upload/site-asset', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data as { url: string; secure_url: string; public_id: string };
  }
};
