import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL as string;

export interface RoleData {
  _id: string;
  name: string;
  permissions: string[];
  isActive: 'active' | 'inactive';
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleData {
  name: string;
  permissions: string[];
  isActive?: 'active' | 'inactive';
}

export interface UpdateRoleData {
  name?: string;
  permissions?: string[];
  isActive?: 'active' | 'inactive';
}

export interface RolesResponse {
  data: RoleData[];
  total: number;
  page: number;
  limit: number;
}

// Fetch all roles with pagination and filters
export const fetchRoles = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<RolesResponse> => {
  const response = await axios.get(`${API_BASE_URL}/admin/roles`, {
    params,
    withCredentials: false,
  });
  return response.data as RolesResponse;
};

// Fetch single role by ID
export const fetchRoleById = async (id: string): Promise<RoleData> => {
  const response = await axios.get(`${API_BASE_URL}/admin/roles/${id}`, {
    withCredentials: false,
  });
  return response.data as RoleData;
};

// Create new role
export const createRole = async (data: CreateRoleData): Promise<RoleData> => {
  const response = await axios.post(`${API_BASE_URL}/admin/roles/create`, data, {
    withCredentials: false,
  });
  return response.data as RoleData;
};

// Update role
export const updateRole = async (id: string, data: UpdateRoleData): Promise<RoleData> => {
  const response = await axios.patch(`${API_BASE_URL}/admin/roles/${id}`, data, {
    withCredentials: false,
  });
  return response.data as RoleData;
};

// Delete role (soft delete)
export const deleteRole = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/admin/roles/${id}`, {
    withCredentials: false,
  });
};

// Available permissions list
export const AVAILABLE_PERMISSIONS = [
  'users.read',
  'users.write',
  'users.delete',
  'roles.read',
  'roles.write',
  'roles.delete',
  'jobs.read',
  'jobs.write',
  'jobs.delete',
  'companies.read',
  'companies.write',
  'companies.delete',
  'applications.read',
  'applications.write',
  'applications.delete',
  'admin.access',
  'system.manage'
];
