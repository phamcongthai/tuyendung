import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jobs, JobsDocument, JobsStatus } from './jobs.schema';
import { CreateJobDto } from './dto/request/create-job.dto';
import { UpdateJobDto } from './dto/request/update-job.dto';
import { buildNameSearchQuery } from 'src/utils/buildSearchQuery';
import cloudinary from '../../utils/cloudinary.config';
import * as streamifier from 'streamifier';
import { generateUniqueSlug } from '../../utils/slug';
import { JobsRepository } from './repositories/jobs.repository';
@Injectable()
export class JobsService {
    constructor(private readonly jobsRepo: JobsRepository) {}
 //[GET] : Lấy ra toàn bộ bản ghi 
  async findAll(
    page: number,
    limit: number,
    search: string,
    status?: string,
  ): Promise<{ data: Jobs[]; total: number }> {
    return await this.jobsRepo.findAll(page, limit, search, status);
  }
//[POST] : Tạo mới bản ghi
  async create(
    createJobDto: CreateJobDto,
    files?: Express.Multer.File[],
  ): Promise<Jobs> {
    return await this.jobsRepo.create(createJobDto, files);
  }

  //[PATCH] : Cập nhật bản ghi
  async update(
    id: string,
    updateJobDto: UpdateJobDto,
    files?: Express.Multer.File[],
  ): Promise<Jobs> {
    return await this.jobsRepo.update(id, updateJobDto, files);
  }

  //[PATCH] : Xóa ảnh của job
  async removeImage(id: string, imageUrl: string): Promise<Jobs> {
    return await this.jobsRepo.removeImage(id, imageUrl);
  }
  //[GET] : Lấy ra chi tiết bản ghi 
  async detail(id){
    return await this.jobsRepo.detail(id);
  }
  //[PATCH] : Xóa bản ghi
  async delete(id){
    return await this.jobsRepo.delete(id);
  }

  //[PATCH] : Thay đổi trạng thái active/inactive
  async toggleStatus(id: string): Promise<Jobs> {
    return await this.jobsRepo.toggleStatus(id);
  }
}
