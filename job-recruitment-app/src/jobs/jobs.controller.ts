import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';

@Controller('admin/jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
    @Query('status') status?: string,
  ) {
    return this.jobsService.findAll(Number(page), Number(limit), search, status);
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Body() createJobDto: CreateJobDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.jobsService.create(createJobDto, files);
  }
}
