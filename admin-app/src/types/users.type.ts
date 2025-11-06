export interface UserData {
  _id: string;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateUserPayload = Omit<
  UserData,
  '_id' | 'createdAt' | 'updatedAt'
>;

export type UpdateUserPayload = Partial<CreateUserPayload>;
