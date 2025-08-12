import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recruiter, RecruiterDocument, RecruiterStatus } from './recruiter.schema';
import { CreateRecruiterDto } from './dto/create-recruiter.dto';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';
import { buildNameSearchQuery } from 'src/utils/buildSearchQuery';
import cloudinary from '../utils/cloudinary.config';
import * as streamifier from 'streamifier';

@Injectable()
export class RecruiterService {
  constructor(
    @InjectModel(Recruiter.name) private recruiterModel: Model<RecruiterDocument>,
  ) {}

  // ✅ Tạo recruiter không có avatar
  async create(createRecruiterDto: CreateRecruiterDto): Promise<Recruiter> {
    const createdRecruiter = new this.recruiterModel(createRecruiterDto);
    return createdRecruiter.save();
  }

  // ✅ Tạo recruiter có avatar
  async createWithAvatar(createRecruiterDto: CreateRecruiterDto, file?: Express.Multer.File): Promise<Recruiter> {
    let avatarUrl = '';

    if (file) {
      const result = await this.uploadToCloudinary(file, 'recruiters');
      avatarUrl = result.secure_url;
    }

    const recruiterData = {
      ...createRecruiterDto,
      avatar: avatarUrl || undefined,
    };

    const createdRecruiter = new this.recruiterModel(recruiterData);
    return createdRecruiter.save();
  }

  // ✅ Upload ảnh đại diện riêng
  async uploadAvatar(id: string, file: Express.Multer.File): Promise<Recruiter | null> {
    const result = await this.uploadToCloudinary(file, 'recruiters', `recruiter_${id}`);

    const updatedRecruiter = await this.recruiterModel.findByIdAndUpdate(
      id,
      { avatar: result.secure_url },
      { new: true },
    ).exec();

    return updatedRecruiter;
  }

  // ✅ Upload helper (từ buffer)
  private uploadToCloudinary(file: Express.Multer.File, folder: string, publicId?: string): Promise<{ secure_url: string }> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          width: 300,
          crop: 'scale',
        },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  }

  // ✅ Danh sách + tìm kiếm + phân trang
  async findAll(page: number, limit: number, search: string, status?: string): Promise<{ data: Recruiter[]; total: number }> {
    const query: any = {
      ...buildNameSearchQuery(search), // nếu có hỗ trợ tìm kiếm theo tên
      deleted: false,
    };

    // Thêm lọc theo status nếu có
    if (status && (status === RecruiterStatus.ACTIVE || status === RecruiterStatus.INACTIVE)) {
      query.status = status;
    } else {
      // Nếu không có status filter, chỉ lấy active
      query.status = RecruiterStatus.ACTIVE;
    }

    const data = await this.recruiterModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await this.recruiterModel.countDocuments(query);
    return { data, total };
  }

  // ✅ Chi tiết
  async detail(id: string): Promise<Recruiter | null> {
    const data = await this.recruiterModel.findById(id).exec();
    return data;
  }

  // ✅ Cập nhật thông tin
  async edit(id: string, dto: UpdateRecruiterDto): Promise<Recruiter | null> {
    const updatedRecruiter = await this.recruiterModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    }).exec();

    return updatedRecruiter;
  }

  // ✅ Xoá avatar khỏi Cloudinary + cập nhật DB
  async deleteAvatar(id: string): Promise<Recruiter | null> {
    const recruiter = await this.recruiterModel.findById(id).exec();
    if (!recruiter || !recruiter.avatar) return recruiter;

    const urlParts = recruiter.avatar.split('/');
    const publicId = urlParts[urlParts.length - 1].split('.')[0];
    const folder = 'recruiters';

    try {
      await cloudinary.uploader.destroy(`${folder}/${publicId}`);
    } catch (error) {
      console.error('❌ Lỗi khi xoá ảnh trên Cloudinary:', error);
    }

    const updatedRecruiter = await this.recruiterModel.findByIdAndUpdate(
      id,
      { avatar: null },
      { new: true },
    ).exec();

    return updatedRecruiter;
  }
  //Cập nhật trạng thái sang đã xóa :
  async deleteRecruiter(id: string) : Promise<Recruiter | null> {
    const recruiter = await this.recruiterModel.findByIdAndUpdate(id, 
    { deleted: true },
    { new: true }
  ).exec();
  return recruiter;
  }

  // ✅ Toggle trạng thái active/inactive
  async toggleStatus(id: string): Promise<Recruiter | null> {
    const recruiter = await this.recruiterModel.findById(id).exec();
    if (!recruiter) return null;

    const newStatus = recruiter.status === RecruiterStatus.ACTIVE 
      ? RecruiterStatus.INACTIVE 
      : RecruiterStatus.ACTIVE;

    const updatedRecruiter = await this.recruiterModel.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    ).exec();

    return updatedRecruiter;
  }
}
