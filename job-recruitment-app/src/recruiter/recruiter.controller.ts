import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RecruiterService } from './recruiter.service';
import { CreateRecruiterDto } from './dto/create-recruiter.dto';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';
import { multerConfig } from '../utils/multer.config';

@Controller('admin/recruiters')
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}

  // [GET] Danh sách nhà tuyển dụng (có tìm kiếm, phân trang)
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('status') status?: string,
  ) {
    return this.recruiterService.findAll(page, limit, search, status);
  }

  // [POST] Tạo nhà tuyển dụng (không avatar)
  @Post('create')
  create(@Body() dto: CreateRecruiterDto) {
    return this.recruiterService.create(dto);
  }

  // [POST] Tạo nhà tuyển dụng có avatar
  @Post('create-with-avatar')
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  async createWithAvatar(
    @Body() dto: CreateRecruiterDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.recruiterService.createWithAvatar(dto, file);
  }

  // [GET] Chi tiết nhà tuyển dụng
  @Get('detail/:id')
  detail(@Param('id') id: string) {
    return this.recruiterService.detail(id);
  }

  // [PATCH] Cập nhật nhà tuyển dụng
  @Patch('edit/:id')
  edit(@Param('id') id: string, @Body() dto: UpdateRecruiterDto) {
    return this.recruiterService.edit(id, dto);
  }

  // [POST] Upload avatar riêng
  @Post('upload-avatar/:id')
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|webp)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Không có file nào được upload');
    }

    const result = await this.recruiterService.uploadAvatar(id, file);

    if (!result || !result.avatar) {
      throw new BadRequestException('Không thể upload ảnh đại diện');
    }

    return result; // { avatar: string }
  }

  // [DELETE] Xoá avatar nhà tuyển dụng
  @Delete('delete-avatar/:id')
  async deleteAvatar(@Param('id') id: string) {
    return this.recruiterService.deleteAvatar(id);
  }
  //[PATCH] Đổi trạng thái sang xóa
  @Patch('delete-recruiter/:id')
  async deleteRecruiter(@Param('id') id: string){
    return this.recruiterService.deleteRecruiter(id);
  }

  // [PATCH] Thay đổi trạng thái active/inactive
  @Patch('toggle-status/:id')
  async toggleStatus(@Param('id') id: string) {
    return this.recruiterService.toggleStatus(id);
  }
}
