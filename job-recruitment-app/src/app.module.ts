// src/app.module.ts
import { Module, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecruiterModule } from './modules/recruiters/recruiter.module';
import { cloudinaryConfig } from './utils/cloudinary.config';
import { JobsModule } from './modules/jobs/jobs.module';
import { JobCategoriesModule } from './modules/job-categories/job-categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
        connectionFactory: (connection) => {
          Logger.log('✅ Đã kết nối MongoDB thành công!', 'MongoDB');
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    RecruiterModule,
    JobsModule,
    JobCategoriesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    // Initialize Cloudinary configuration
    cloudinaryConfig();
    Logger.log('✅ Đã khởi tạo Cloudinary thành công!', 'Cloudinary');
  }
}
