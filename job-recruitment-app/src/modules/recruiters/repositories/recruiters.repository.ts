import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recruiter, RecruiterDocument, RecruiterStatus } from '../recruiter.schema';
import { CreateRecruiterDto } from '../dto/create-recruiter.dto';
import { UpdateRecruiterDto } from '../dto/update-recruiter.dto';
import { buildNameSearchQuery } from 'src/utils/buildSearchQuery';

@Injectable()
export class RecruiterRepository {
  constructor(
    @InjectModel(Recruiter.name) private recruiterModel: Model<RecruiterDocument>,
  ) {}

  create(data: CreateRecruiterDto) {
    const created = new this.recruiterModel(data);
    return created.save();
  }

  findAll(page: number, limit: number, search: string, status?: string) {
    const query: any = {
      ...buildNameSearchQuery(search),
      deleted: false,
    };

    if (status && (status === RecruiterStatus.ACTIVE || status === RecruiterStatus.INACTIVE)) {
      query.status = status;
    } else {
      query.status = RecruiterStatus.ACTIVE;
    }

    return Promise.all([
      this.recruiterModel.find(query).skip((page - 1) * limit).limit(limit).exec(),
      this.recruiterModel.countDocuments(query),
    ]).then(([data, total]) => ({ data, total }));
  }

  findById(id: string) {
    return this.recruiterModel.findById(id).exec();
  }

  updateById(id: string, dto: UpdateRecruiterDto) {
    return this.recruiterModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    }).exec();
  }

  updateAvatar(id: string, avatarUrl: string) {
    return this.recruiterModel.findByIdAndUpdate(id, { avatar: avatarUrl }, { new: true }).exec();
  }

  removeAvatar(id: string) {
    return this.recruiterModel.findByIdAndUpdate(id, { avatar: null }, { new: true }).exec();
  }

  markDeleted(id: string) {
    return this.recruiterModel.findByIdAndUpdate(id, { deleted: true }, { new: true }).exec();
  }

  toggleStatus(id: string, newStatus: RecruiterStatus) {
    return this.recruiterModel.findByIdAndUpdate(id, { status: newStatus }, { new: true }).exec();
  }
}
