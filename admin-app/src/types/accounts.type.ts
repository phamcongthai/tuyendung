export interface AccountData {
  _id: string;
  email: string;
  status: 'active' | 'inactive';   
  isVerified: boolean;
  emailVerifiedAt?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  roles?: AccountRole[];
  profile?: UserProfile | RecruiterProfile | AdminProfile;
}

export interface AccountRole {
  _id: string;
  name: string;
  displayName: string;
  permissions: string[];
  assignedAt: string;
}

export interface UserProfile {
  _id: string;
  fullName: string;
  avatar?: string;
  phone?: string;
  address?: string;
  resume?: string;
  dateOfBirth?: string;
  gender?: string;
  status: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  education?: string;
}

export interface RecruiterProfile {
  _id: string;
  fullName: string;
  gender: string;
  phone: string;
  company: string;
  province?: string;
  district?: string;
  status: string;
  avatar?: string;
  companyLogo?: string;
  companyDescription?: string;
  companySize?: string;
  companyWebsite?: string;
  position?: string;
  bio?: string;
  specializations?: string[];
  experience?: string;
  education?: string;
}

export interface AdminProfile {
  _id: string;
  fullName: string;
  avatar?: string;
  phone?: string;
  level: string;
  status: string;
  bio?: string;
  permissions: string[];
  lastActivityAt?: string;
}

export interface CreateAccountData {
  email: string;
  password: string;
  roleId: string;
  profile: {
    type: 'USER' | 'RECRUITER' | 'ADMIN';
    data: Partial<UserProfile | RecruiterProfile | AdminProfile>;
  };
}

export interface UpdateAccountData {
  email?: string;
  passwordHash?: string;
  isActive?: boolean;
  isVerified?: boolean;
  roleIds?: string[];
  profile?: Partial<UserProfile | RecruiterProfile | AdminProfile>;
}

export interface AccountStats {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  unverified: number;
  byRole: {
    [key: string]: number;
  };
}

export interface RoleData {
  _id: string;
  name: string;
  displayName: string;
  permissions: string[];
  type: 'SYSTEM' | 'CUSTOM';
  priority: number;
  isActive: boolean;
  description?: string;
}
