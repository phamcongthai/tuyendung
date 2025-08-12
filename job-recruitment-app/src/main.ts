// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { cloudinaryConfig } from './utils/cloudinary.config'; // ✅ gọi config
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); // ✅ Load biến môi trường từ .env

  // ✅ Khởi tạo Cloudinary trước khi app chạy
  cloudinaryConfig();

  const app = await NestFactory.create(AppModule);

  // ✅ Cho phép CORS từ FE
  app.enableCors({
    origin: 'http://localhost:5173', // hoặc domain FE thực tế
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
