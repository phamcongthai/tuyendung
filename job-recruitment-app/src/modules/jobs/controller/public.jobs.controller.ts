import { Controller, Get, Query } from '@nestjs/common';
import { JobsService } from '../jobs.service';
import { JobResponseDto } from '../dto/response/job-response.dto';
import { plainToInstance } from 'class-transformer';
@Controller('jobs')
export class PublicJobsController {
  constructor(private readonly jobsService: JobsService) {}

  // [GET] : /jobs
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = '', // Client không được phép truyền status ở đây
  ) {
    const status = 'ACTIVE';

    // Lấy toàn bộ dữ liệu job từ service
    const {data, total} = await this.jobsService.findAll(
      Number(page),
      Number(limit),
      search,
      status,
    );
    //Bên FE nó nhận về data và total chứ không chỉ mỗi data (xem lại file apis bên FE)
    return {
      data : plainToInstance(JobResponseDto, data, { //Mặc định giá trị nhận ra từ db là plain
                                                   //Hàm này để chuyển từ plain sang 1 instance cụ thể.
      excludeExtraneousValues : true //Chỉ nhận các giá trị có trường @Expose trong dto.
    }), total,
    }
  }
}
