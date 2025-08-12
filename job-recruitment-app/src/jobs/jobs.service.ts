import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Jobs, JobsDocument, JobsStatus } from './jobs.schema';
import { CreateJobDto } from './dto/create-job.dto';
import { buildNameSearchQuery } from 'src/utils/buildSearchQuery';
import cloudinary from '../utils/cloudinary.config';
import * as streamifier from 'streamifier';
import { generateUniqueSlug } from '../utils/slug';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Jobs.name) private jobsModel: Model<JobsDocument>,
  ) {}

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
}
