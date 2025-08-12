import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Recruiter, RecruiterSchema } from './recruiter.schema';
import { RecruiterController } from './recruiter.controller';
import { RecruiterService } from './recruiter.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Recruiter.name, schema: RecruiterSchema }]),
  ],
  controllers: [RecruiterController],
  providers: [RecruiterService],
})
export class RecruiterModule {}
