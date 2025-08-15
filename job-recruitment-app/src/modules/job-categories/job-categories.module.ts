import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobCategories, JobCategoriesSchema } from './job-categories.schema';
import { JobCategoriesService } from './job-categories.service';
import { JobCategoriesController } from './job-categories.controller';
import { JobCategoriesRepository } from './repositories/job-categories.repository';
@Module({
  imports: [MongooseModule.forFeature([{ name: JobCategories.name, schema: JobCategoriesSchema }])],
  controllers: [JobCategoriesController],
  providers: [JobCategoriesService, JobCategoriesRepository],
})
export class JobCategoriesModule {}
