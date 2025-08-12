import { Injectable } from '@nestjs/common';
import { Recruiter, RecruiterStatus } from './recruiter.schema';
import { CreateRecruiterDto } from './dto/create-recruiter.dto';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';
import { RecruiterRepository } from './repositories/recruiters.repository';
import cloudinary from '../../utils/cloudinary.config';
import * as streamifier from 'streamifier';

@Injectable()
export class RecruiterService {
  constructor(private readonly recruiterRepo: RecruiterRepository) {}

  // Tạo recruiter không có avatar
  create(dto: CreateRecruiterDto): Promise<Recruiter> {
    return this.recruiterRepo.create(dto);
  }

  // Tạo recruiter có avatar
  async createWithAvatar(dto: CreateRecruiterDto, file?: Express.Multer.File): Promise<Recruiter> {
    let avatarUrl = '';
    if (file) {
      const result = await this.uploadToCloudinary(file, 'recruiters');
      avatarUrl = result.secure_url;
    }
    return this.recruiterRepo.create({ ...dto, avatar: avatarUrl || undefined });
  }

  // Upload avatar riêng
  async uploadAvatar(id: string, file: Express.Multer.File): Promise<Recruiter | null> {
    const result = await this.uploadToCloudinary(file, 'recruiters', `recruiter_${id}`);
    return this.recruiterRepo.updateAvatar(id, result.secure_url);
  }

  // Danh sách + tìm kiếm + phân trang
  findAll(page: number, limit: number, search: string, status?: string) {
    return this.recruiterRepo.findAll(page, limit, search, status);
  }

  // Chi tiết
  detail(id: string) {
    return this.recruiterRepo.findById(id);
  }

  // Cập nhật thông tin
  edit(id: string, dto: UpdateRecruiterDto) {
    return this.recruiterRepo.updateById(id, dto);
  }

  // Xoá avatar khỏi Cloudinary + DB
  async deleteAvatar(id: string) {
    const recruiter = await this.recruiterRepo.findById(id);
    if (!recruiter || !recruiter.avatar) return recruiter;

    const urlParts = recruiter.avatar.split('/');
    const publicId = urlParts[urlParts.length - 1].split('.')[0];
    const folder = 'recruiters';

    try {
      await cloudinary.uploader.destroy(`${folder}/${publicId}`);
    } catch (error) {
      console.error('❌ Lỗi xoá ảnh trên Cloudinary:', error);
    }

    return this.recruiterRepo.removeAvatar(id);
  }

  // Đánh dấu đã xóa
  deleteRecruiter(id: string) {
    return this.recruiterRepo.markDeleted(id);
  }

  // Toggle status
  async toggleStatus(id: string) {
    const recruiter = await this.recruiterRepo.findById(id);
    if (!recruiter) return null;

    const newStatus =
      recruiter.status === RecruiterStatus.ACTIVE
        ? RecruiterStatus.INACTIVE
        : RecruiterStatus.ACTIVE;

    return this.recruiterRepo.toggleStatus(id, newStatus);
  }

  // Helper upload Cloudinary
  private uploadToCloudinary(file: Express.Multer.File, folder: string, publicId?: string) {
    return new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, public_id: publicId, width: 300, crop: 'scale' },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  }
}
