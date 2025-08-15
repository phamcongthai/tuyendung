import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { JobCategoriesService } from './job-categories.service';
import { CreateJobCategoryDto } from './dto/create-job-categories.dto';
import { UpdateJobCategoryDto } from './dto/update-job-categories.dto';

@Controller('admin/job-categories')
export class JobCategoriesController {
  constructor(private readonly jobsService: JobCategoriesService) {}

  // [GET] : /admin/jobs
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
    @Query('status') status?: string,
  ) {
    return this.jobsService.findAll(Number(page), Number(limit), search, status);
  }

  // [POST] : /admin/jobs
  @Post()
  async create(
    @Body() createJobDto: CreateJobCategoryDto,
  ) {
    return this.jobsService.create(createJobDto);
  }

  // [PATCH] : /admin/jobs/:id
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobCategoryDto,
  ) {
    return this.jobsService.update(id, updateJobDto);
  }

  // [GET] : /admin/jobs/detail/:id
  @Get('detail/:id')
  async detail(@Param('id') id: string) {
    return this.jobsService.detail(id);
  }

  // [PATCH] : /admin/jobs/delete/:id
  @Patch('delete/:id')
  async delete(@Param('id') id: string) {
    return this.jobsService.delete(id);
  }

  // [PATCH] : /admin/jobs/toggle-status/:id
  @Patch('toggle-status/:id')
  async toggleStatus(@Param('id') id: string) {
    return this.jobsService.toggleStatus(id);
  }
}
