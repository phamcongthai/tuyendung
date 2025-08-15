import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UploadedFiles,
  UseInterceptors,
  Param,
  Patch
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JobsService } from '../jobs.service';
import { CreateJobDto } from '../dto/request/create-job.dto';
import { UpdateJobDto } from '../dto/request/update-job.dto';
@Controller('admin/jobs')
export class AdminJobsController {
  constructor(private readonly jobsService: JobsService) {}
  //[GET] : /admin
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '',
    @Query('status') status?: string,
  ) {
    return this.jobsService.findAll(Number(page), Number(limit), search, status);
  }
  //[POST] : /admin
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Body() createJobDto: CreateJobDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.jobsService.create(createJobDto, files);
  }

  //[PATCH] : /admin/:id
  @Patch('edit/:id')
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ) {
    return this.jobsService.update(id, updateJobDto, files);
  }
  //[GET] : /admin/detail/:id
  @Get('detail/:id')
  async detail(
    @Param('id') id : string
  ){
    return this.jobsService.detail(id);
  }
  //[PATCH] : /admin/delete/:id
  @Patch('delete/:id')
  async delete(
    @Param('id') id : string
  ){
    return this.jobsService.delete(id);
  }

  //[PATCH] : /admin/toggle-status/:id
  @Patch('toggle-status/:id')
  async toggleStatus(
    @Param('id') id: string
  ) {
    return this.jobsService.toggleStatus(id);
  }

  //[PATCH] : /admin/remove-image/:id
  @Patch('remove-image/:id')
  async removeImage(
    @Param('id') id: string,
    @Body() body: { imageUrl: string }
  ) {
    return this.jobsService.removeImage(id, body.imageUrl);
  }
}
