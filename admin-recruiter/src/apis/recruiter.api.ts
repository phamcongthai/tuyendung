import axios from 'axios';
import type { RecruiterData, UploadAvatarResponse } from '../types/recruiter.type';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Lấy danh sách recruiter
export const fetchRecruiters = async ({
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
  const res = await axiosInstance.get('/admin/recruiters', {
    params: { page, limit, search, status },
  });
  return res.data;
};

// Tạo mới recruiter
export const createRecruiter = async (recruiter: Omit<RecruiterData, '_id'> & { password: string }) => {
  const res = await axiosInstance.post('/admin/recruiters/create', recruiter);
  return res.data;
};

// Tạo mới recruiter với avatar
export const createRecruiterWithAvatar = async (
  recruiter: Omit<RecruiterData, '_id' | 'avatar'> & { password: string },
  avatarFile?: File
) => {
  const formData = new FormData();

  Object.keys(recruiter).forEach(key => {
    const value = recruiter[key as keyof typeof recruiter];
    if (value !== undefined) {
      formData.append(key, value);
    }
  });

  if (avatarFile) {
    formData.append('avatar', avatarFile);
  }

  const res = await axiosInstance.post('/admin/recruiters/create-with-avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

// Lấy chi tiết một recruiter
export const fetchRecruiterById = async (id: string): Promise<RecruiterData> => {
  try {
    const res = await axiosInstance.get(`/admin/recruiters/detail/${id}`);
    return res.data as RecruiterData;
  } catch (error: any) {
    console.error('Lỗi khi lấy chi tiết recruiter:', error);
    throw error;
  }
};

// Cập nhật recruiter
export const editRecruiter = async (id: string, recruiter: Partial<Omit<RecruiterData, '_id'>>) => {
  try {
    const res = await axiosInstance.patch(`/admin/recruiters/edit/${id}`, recruiter);
    return res.data;
  } catch (error: any) {
    console.error('Lỗi khi cập nhật recruiter:', error);
    throw error;
  }
};

// Upload avatar
export const uploadAvatar = async (
  id: string,
  file: File
): Promise<UploadAvatarResponse> => {
  const formData = new FormData();
  formData.append('avatar', file);

  const res = await axiosInstance.post(`/admin/recruiters/upload-avatar/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data as UploadAvatarResponse;
};

// Delete avatar
export const deleteAvatar = async (id: string) => {
  try {
    const res = await axiosInstance.delete(`/admin/recruiters/delete-avatar/${id}`);
    return res.data;
  } catch (error: any) {
    console.error('Lỗi khi xóa avatar:', error);
    throw error;
  }
};

//Delete recruiter
export const deleteRecruiter = async (id: string) => {
  try {
    const res = await axiosInstance.patch(`/admin/recruiters/delete-recruiter/${id}`);
    return res.data;
  } catch (error: any) {
    console.error('Lỗi khi cập nhật recruiter:', error);
    throw error;
  }
}

// Toggle trạng thái active/inactive
export const toggleRecruiterStatus = async (id: string) => {
  try {
    const res = await axiosInstance.patch(`/admin/recruiters/toggle-status/${id}`);
    return res.data;
  } catch (error: any) {
    console.error('Lỗi khi thay đổi trạng thái recruiter:', error);
    throw error;
  }
}
