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
