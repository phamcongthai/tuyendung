import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
});

export interface CVSampleData {
  _id: string;
  name: string;
  title: string;
  description?: string;
  demoImage?: string;
  html: string;
  css: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCVSamplePayload {
  name: string;
  title: string;
  description?: string;
  demoImage?: string;
  html: string;
  css: string;
  isActive?: boolean;
}

export interface UpdateCVSamplePayload {
  name?: string;
  title?: string;
  description?: string;
  demoImage?: string;
  html?: string;
  css?: string;
  isActive?: boolean;
}

export interface CVSamplesResponse {
  data: CVSampleData[];
  total: number;
  page: number;
  limit: number;
}

// Lấy danh sách CV samples
export const fetchCVSamples = async ({
  page = 1,
  limit = 10,
  isActive,
}: {
  page?: number;
  limit?: number;
  isActive?: boolean;
}): Promise<CVSamplesResponse> => {
  const params: any = { page, limit };
  if (isActive !== undefined) {
    params.isActive = isActive;
  }
  
  const res = await axiosInstance.get<CVSamplesResponse>('/cv-samples', { params });
  return res.data;
};

// Tạo CV sample mới
export const createCVSample = async (cvSample: CreateCVSamplePayload): Promise<{ message: string; cvSample: CVSampleData }> => {
  const res = await axiosInstance.post<{ message: string; cvSample: CVSampleData }>('/cv-samples', cvSample);
  return res.data;
};

// Cập nhật CV sample
export const updateCVSample = async (id: string, cvSample: UpdateCVSamplePayload): Promise<{ message: string; cvSample: CVSampleData }> => {
  const res = await axiosInstance.patch<{ message: string; cvSample: CVSampleData }>(`/cv-samples/${id}`, cvSample);
  return res.data;
};

// Lấy chi tiết CV sample
export const fetchCVSampleById = async (id: string): Promise<CVSampleData> => {
  const res = await axiosInstance.get<CVSampleData>(`/cv-samples/${id}`);
  return res.data;
};

// Xóa mềm CV sample
export const deleteCVSample = async (id: string): Promise<{ message: string }> => {
  const res = await axiosInstance.delete<{ message: string }>(`/cv-samples/${id}`);
  return res.data;
};

// Xóa vĩnh viễn CV sample
export const hardDeleteCVSample = async (id: string): Promise<{ message: string }> => {
  const res = await axiosInstance.delete<{ message: string }>(`/cv-samples/${id}/hard`);
  return res.data;
};

// Bật/tắt trạng thái CV sample
export const toggleCVSampleStatus = async (id: string): Promise<{ message: string; cvSample: CVSampleData }> => {
  const res = await axiosInstance.patch<{ message: string; cvSample: CVSampleData }>(`/cv-samples/${id}/toggle-active`);
  return res.data;
};

// Lấy danh sách CV samples đang hoạt động
export const fetchActiveCVSamples = async (): Promise<CVSampleData[]> => {
  const res = await axiosInstance.get<CVSampleData[]>('/cv-samples/active');
  return res.data;
};
