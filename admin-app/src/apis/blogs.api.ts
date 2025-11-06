import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
});

export type Blog = {
  _id?: string;
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverImageUrl: string;
  tags?: string[];
  published?: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const blogsApi = {
  listAdmin: async (): Promise<Blog[]> => {
    const res = await axiosInstance.get('/admin/blogs');
    return res.data as Blog[];
  },
  create: async (payload: Omit<Blog, '_id' | 'slug' | 'publishedAt' | 'createdAt' | 'updatedAt'>): Promise<{ message: string; data: Blog }> => {
    const res = await axiosInstance.post('/admin/blogs', payload);
    return res.data as { message: string; data: Blog };
  },
  update: async (id: string, payload: Partial<Blog>): Promise<{ message: string; data: Blog }> => {
    const res = await axiosInstance.patch(`/admin/blogs/${id}`, payload);
    return res.data as { message: string; data: Blog };
  },
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axiosInstance.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data as { url: string; secure_url: string; public_id: string };
  },
};
