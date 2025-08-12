// src/app.module.ts
import { Module, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecruiterModule } from './recruiter/recruiter.module';
import { cloudinaryConfig } from './utils/cloudinary.config';
import { JobsModule } from './jobs/jobs.module';

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
    JobsModule
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
