import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Jobs, JobsSchema } from './jobs.schema';
import { JobsService } from './jobs.service';
import { AdminJobsController } from './controller/admin.jobs.controller';
import { PublicJobsController } from './controller/public.jobs.controller';
import { JobsRepository } from './repositories/jobs.repository';
@Module({
  imports: [MongooseModule.forFeature([{ name: Jobs.name, schema: JobsSchema }])],
  controllers: [AdminJobsController, PublicJobsController],
  providers: [JobsService, JobsRepository],
})
export class JobsModule {}
