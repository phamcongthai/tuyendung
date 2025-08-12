import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jobs, JobsDocument, JobsStatus } from './jobs.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { buildNameSearchQuery } from 'src/utils/buildSearchQuery';
import cloudinary from '../../utils/cloudinary.config';
import * as streamifier from 'streamifier';
import { generateUniqueSlug } from '../../utils/slug';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Jobs.name) private jobsModel: Model<JobsDocument>,
  ) {}
 //[GET] : Lấy ra toàn bộ bản ghi 
  async findAll(
    page: number,
    limit: number,
    search: string,
    status?: string,
  ): Promise<{ data: Jobs[]; total: number }> {
    const query: any = {
      ...buildNameSearchQuery(search),
      deleted: false,
    };

    if (status && (status === JobsStatus.ACTIVE || status === JobsStatus.INACTIVE)) {
      query.status = status;
    } else {
      query.status = JobsStatus.ACTIVE;
    }

    const data = await this.jobsModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await this.jobsModel.countDocuments(query);
    return { data, total };
  }
//[POST] : Tạo mới bản ghi
  async create(
    createJobDto: CreateJobDto,
    files?: Express.Multer.File[],
  ): Promise<Jobs> {
    try {
      // 1. Upload ảnh nếu có
      let uploadedImages: string[] = [];
      if (files && files.length > 0) {
        uploadedImages = await Promise.all(
          files.map((file) => {
            return new Promise<string>((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'jobs' },
                (error, result) => {
                  if (error) return reject(error);
                  resolve(result?.secure_url || '');
                },
              );
              streamifier.createReadStream(file.buffer).pipe(uploadStream);
            });
          }),
        );
      }

      // 2. Tạo slug unique từ title
      const slug = await generateUniqueSlug(this.jobsModel, createJobDto.title);

      // 3. Tạo job mới
      const newJob = new this.jobsModel({
        ...createJobDto,
        slug,
        status: JobsStatus.ACTIVE,
        images: uploadedImages,
      });

      return await newJob.save();
    } catch (error) {
      throw new BadRequestException(`Không thể tạo job: ${error.message}`);
    }
  }

  //[PATCH] : Cập nhật bản ghi
  async update(
    id: string,
    updateJobDto: UpdateJobDto,
    files?: Express.Multer.File[],
  ): Promise<Jobs> {
    try {
      // 1. Tìm job hiện tại
      const existingJob = await this.jobsModel.findById(id);
      if (!existingJob) {
        throw new BadRequestException('Không tìm thấy công việc');
      }

      // 2. Upload ảnh mới nếu có
      let newImages: string[] = [];
      if (files && files.length > 0) {
        newImages = await Promise.all(
          files.map((file) => {
            return new Promise<string>((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                { folder: 'jobs' },
                (error, result) => {
                  if (error) return reject(error);
                  resolve(result?.secure_url || '');
                },
              );
              streamifier.createReadStream(file.buffer).pipe(uploadStream);
            });
          }),
        );
      }

      // 3. Chuẩn bị dữ liệu cập nhật
      const updateData = { ...updateJobDto };
      
      // 4. Xử lý deadline nếu có
      if (updateData.deadline) {
        updateData.deadline = new Date(updateData.deadline).toISOString();
      }
      // 5. Kết hợp ảnh cũ và mới
      if (newImages.length > 0) {
        const existingImages = updateData.images || existingJob.images || [];
        updateData.images = [...existingImages, ...newImages];
      }

      // 6. Cập nhật job
      const updatedJob = await this.jobsModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!updatedJob) {
        throw new BadRequestException('Không thể cập nhật công việc');
      }

      return updatedJob;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Lỗi khi cập nhật công việc: ${error.message}`);
    }
  }

  //[PATCH] : Xóa ảnh của job
  async removeImage(id: string, imageUrl: string): Promise<Jobs> {
    try {
      const job = await this.jobsModel.findById(id);
      if (!job) {
        throw new BadRequestException('Không tìm thấy công việc');
      }

      // Lọc bỏ ảnh cần xóa
      const updatedImages = job.images.filter(img => img !== imageUrl);
      
      const updatedJob = await this.jobsModel.findByIdAndUpdate(
        id,
        { images: updatedImages },
        { new: true }
      );

      if (!updatedJob) {
        throw new BadRequestException('Không thể xóa ảnh');
      }

      return updatedJob;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Lỗi khi xóa ảnh: ${error.message}`);
    }
  }
  //[GET] : Lấy ra chi tiết bản ghi 
  async detail(id){
    return await this.jobsModel.findById(id);
  }
  //[PATCH] : Xóa bản ghi
  async delete(id){
    return await this.jobsModel.updateOne({_id : id}, {deleted : true});
  }

  //[PATCH] : Thay đổi trạng thái active/inactive
  async toggleStatus(id: string): Promise<Jobs> {
    try {
      // Tìm job hiện tại
      const job = await this.jobsModel.findById(id);
      if (!job) {
        throw new BadRequestException('Không tìm thấy công việc');
      }

      // Toggle trạng thái
      const newStatus = job.status === JobsStatus.ACTIVE 
        ? JobsStatus.INACTIVE 
        : JobsStatus.ACTIVE;

      // Cập nhật trạng thái
      const updatedJob = await this.jobsModel.findByIdAndUpdate(
        id,
        { 
          status: newStatus,
          isActive: newStatus === JobsStatus.ACTIVE 
        },
        { new: true }
      );

      if (!updatedJob) {
        throw new BadRequestException('Không thể cập nhật trạng thái');
      }

      return updatedJob;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Lỗi khi thay đổi trạng thái: ${error.message}`);
    }
  }
}
