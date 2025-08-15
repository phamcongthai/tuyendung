// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { cloudinaryConfig } from './utils/cloudinary.config';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); // Load biến môi trường từ .env

  // Khởi tạo Cloudinary trước khi app chạy
  cloudinaryConfig();

  const app = await NestFactory.create(AppModule);

  // Cấu hình CORS linh hoạt
  app.enableCors({
    origin: (origin, callback) => {
      // Cho phép request từ bất kỳ origin nào trong môi trường dev
      if (!origin) return callback(null, true); 
      return callback(null, true);
    },
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
