export interface RecruiterData {
  _id: string;
  fullName: string;
  gender: string;
  email: string;
  phone: string;
  company: string;
  province: string;
  district: string;
  status: string;
  avatar?: string;
}
export interface UploadAvatarResponse {
  avatar: string;
}