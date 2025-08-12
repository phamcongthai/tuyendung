import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Jobs, JobsSchema } from './jobs.schema';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Jobs.name, schema: JobsSchema }])],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
