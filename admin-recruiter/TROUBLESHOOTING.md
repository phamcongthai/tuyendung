# Hướng dẫn khắc phục sự cố Upload ảnh

## Các vấn đề thường gặp và cách khắc phục

### 1. Không thể upload ảnh

#### Kiểm tra Backend:
1. **Đảm bảo backend đang chạy:**
   ```bash
   cd job-recruitment-app
   npm run start:dev
   ```

2. **Kiểm tra Cloudinary configuration:**
   - Tạo file `.env` trong thư mục `job-recruitment-app`
   - Thêm các biến môi trường:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Kiểm tra MongoDB connection:**
   - Đảm bảo MongoDB đang chạy
   - Thêm vào file `.env`:
   ```env
   MONGO_URL=mongodb://localhost:27017/job-recruitment
   ```

#### Kiểm tra Frontend:
1. **Đảm bảo frontend đang chạy:**
   ```bash
   cd admin-recruiter
   npm run dev
   ```

2. **Kiểm tra API URL:**
   - Tạo file `.env` trong thư mục `admin-recruiter`
   - Thêm:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

### 2. Lỗi "Network Error"

#### Nguyên nhân:
- Backend không chạy
- CORS configuration sai
- Port không đúng

#### Khắc phục:
1. **Kiểm tra backend có chạy không:**
   ```bash
   curl http://localhost:3000/admin/recruiters
   ```

2. **Kiểm tra CORS trong backend:**
   - Đảm bảo frontend URL được cho phép

### 3. Lỗi "File too large"

#### Nguyên nhân:
- File ảnh lớn hơn 2MB

#### Khắc phục:
- Nén ảnh trước khi upload
- Chọn ảnh có dung lượng nhỏ hơn 2MB

### 4. Lỗi "Invalid file type"

#### Nguyên nhân:
- File không phải JPG/PNG

#### Khắc phục:
- Chỉ upload file JPG hoặc PNG

### 5. Lỗi Cloudinary

#### Nguyên nhân:
- API key sai
- Cloudinary account không hoạt động

#### Khắc phục:
1. **Kiểm tra Cloudinary dashboard**
2. **Verify API credentials**
3. **Kiểm tra account status**

### 6. Ảnh không hiển thị sau khi upload

#### Nguyên nhân:
- URL ảnh không đúng
- CORS policy

#### Khắc phục:
1. **Kiểm tra response từ API**
2. **Kiểm tra URL ảnh trong database**
3. **Kiểm tra Cloudinary URL**

## Debug Steps

### 1. Kiểm tra Console
- Mở Developer Tools (F12)
- Xem tab Console có lỗi gì không

### 2. Kiểm tra Network
- Mở Developer Tools (F12)
- Xem tab Network
- Kiểm tra request/response của API

### 3. Kiểm tra Backend Logs
```bash
cd job-recruitment-app
npm run start:dev
```
- Xem logs khi upload ảnh

### 4. Test API trực tiếp
```bash
# Test upload ảnh
curl -X POST http://localhost:3000/admin/recruiters/upload-avatar/YOUR_RECRUITER_ID \
  -F "avatar=@/path/to/your/image.jpg"
```

## Các file quan trọng cần kiểm tra

### Backend:
- `job-recruitment-app/src/recruiter/recruiter.controller.ts`
- `job-recruitment-app/src/recruiter/recruiter.service.ts`
- `job-recruitment-app/src/utils/cloudinary.config.ts`
- `job-recruitment-app/src/utils/multer.config.ts`

### Frontend:
- `admin-recruiter/src/apis/recruiter.api.ts`
- `admin-recruiter/src/components/ImageUpload.tsx`
- `admin-recruiter/src/pages/Recruiters/CreateRecruiter.tsx`
- `admin-recruiter/src/pages/Recruiters/EditRecruiter.tsx`

## Liên hệ hỗ trợ

Nếu vẫn gặp vấn đề, hãy:
1. Kiểm tra logs backend
2. Kiểm tra console frontend
3. Chụp màn hình lỗi
4. Mô tả chi tiết các bước thực hiện 