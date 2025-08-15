import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jobs, JobsDocument, JobsStatus } from '../jobs.schema';
import { CreateJobDto } from '../dto/request/create-job.dto';
import { UpdateJobDto } from '../dto/request/update-job.dto';
import { buildNameSearchQuery } from 'src/utils/buildSearchQuery';
import cloudinary from '../../../utils/cloudinary.config';
import * as streamifier from 'streamifier';
import { generateUniqueSlug } from '../../../utils/slug';

@Injectable()
export class JobsRepository {
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
      .populate({ path: 'categoryId', select: 'title' })
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
      // Upload ảnh nếu có
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

      // Tạo slug unique từ title
      const slug = await generateUniqueSlug<JobsDocument>(
        this.jobsModel,
        createJobDto.title
      );

      // Tạo job mới
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
      const existingJob = await this.jobsModel.findById(id);
      if (!existingJob) {
        throw new BadRequestException('Không tìm thấy công việc');
      }

      // Upload ảnh mới nếu có
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

      const updateData = { ...updateJobDto };

      // Nếu đổi title → tạo slug mới
      if (updateData.title && updateData.title !== existingJob.title) {
        updateData.slug = await generateUniqueSlug<JobsDocument>(
          this.jobsModel,
          updateData.title,
          id
        );
      }

      // Xử lý deadline nếu có
      if (updateData.deadline) {
        updateData.deadline = new Date(updateData.deadline).toISOString();
      }

      // Kết hợp ảnh cũ và mới
      if (newImages.length > 0) {
        const existingImages = existingJob.images || [];
        updateData.images = [...existingImages, ...newImages];
      }

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
      if (error instanceof BadRequestException) throw error;
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
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(`Lỗi khi xóa ảnh: ${error.message}`);
    }
  }

  async detail(id: string) {
    return await this.jobsModel.findById(id).populate({ path: 'categoryId', select: 'title' });
  }

  async delete(id: string) {
    return await this.jobsModel.updateOne({ _id: id }, { deleted: true });
  }

  async toggleStatus(id: string): Promise<Jobs> {
    try {
      const job = await this.jobsModel.findById(id);
      if (!job) {
        throw new BadRequestException('Không tìm thấy công việc');
      }

      const newStatus = job.status === JobsStatus.ACTIVE 
        ? JobsStatus.INACTIVE 
        : JobsStatus.ACTIVE;

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
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(`Lỗi khi thay đổi trạng thái: ${error.message}`);
    }
  }
}
