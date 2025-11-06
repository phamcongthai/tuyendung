import axios from 'axios';
import type { RolesResponse } from '../types/roles.type';

export interface AccountWithRolesResponse {
  _id: string;
  email: string;
  status: 'active' | 'inactive';
  isVerified: boolean;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
  roleIds: string[];
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// Accounts list
export const fetchAccounts = async ({
  page = 1,
  limit = 10,
  search = '',
  status,
  role,
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  role?: string;
}) => {
  const res = await axiosInstance.get('/admin/accounts', {
    params: { page, limit, search, status, role },
  });
  return res.data;
};

// Create
export const createAccount = async (data: {
  email: string;
  password: string;
  roleId: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'active' | 'inactive';
}) => {
  const res = await axiosInstance.post('/admin/accounts/create', data);
  return res.data;
};

// Detail with roles (returns roleIds)
export const fetchAccountWithRoles = async (id: string): Promise<AccountWithRolesResponse> => {
  const res = await axiosInstance.get(`/admin/accounts/${id}/roles`);
  return res.data as AccountWithRolesResponse;
};

// Update
export const updateAccount = async (id: string, data: Record<string, any>) => {
  const res = await axiosInstance.patch(`/admin/accounts/${id}`, data);
  return res.data;
};

// Delete (soft)
export const deleteAccount = async (id: string) => {
  const res = await axiosInstance.delete(`/admin/accounts/${id}`);
  return res.data;
};

// Toggle status helper (maps boolean-like string to enum string used by backend)
export const updateAccountStatus = async (id: string, isActiveString: 'true' | 'false') => {
  const status = isActiveString === 'true' ? 'active' : 'inactive';
  const res = await axiosInstance.patch(`/admin/accounts/${id}`, { status });
  return res.data;
};

// Verify email (placeholder if BE supports it later)
export const verifyEmail = async (id: string) => {
  const res = await axiosInstance.patch(`/admin/accounts/${id}`, { isVerified: true });
  return res.data;
};

// Re-export roles fetcher for convenience in account pages
export const fetchRoles = async (params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<RolesResponse> => {
  const res = await axiosInstance.get('/admin/roles', { params });
  return res.data as RolesResponse;
};


