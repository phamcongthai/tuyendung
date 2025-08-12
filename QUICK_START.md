# Hướng dẫn nhanh - Test Upload ảnh

## Bước 1: Cấu hình Environment

### Backend (job-recruitment-app)
Tạo file `.env` trong thư mục `job-recruitment-app`:
```env
MONGO_URL=mongodb://localhost:27017/job-recruitment
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (admin-recruiter)
Tạo file `.env` trong thư mục `admin-recruiter`:
```env
VITE_API_URL=http://localhost:3000
```

## Bước 2: Khởi động ứng dụng

### Terminal 1 - Backend
```bash
cd job-recruitment-app
npm install
npm run start:dev
```

### Terminal 2 - Frontend
```bash
cd admin-recruiter
npm install
npm run dev
```

## Bước 3: Test chức năng

1. Mở trình duyệt và truy cập: `http://localhost:5173`
2. Vào trang "Tạo mới nhà tuyển dụng"
3. Chọn ảnh đại diện
4. Điền thông tin và submit

## Bước 4: Kiểm tra kết quả

- Ảnh sẽ được hiển thị ngay sau khi chọn
- Sau khi submit, ảnh sẽ được upload lên Cloudinary
- URL ảnh sẽ được lưu vào database

## Troubleshooting

### Nếu gặp lỗi:
1. Kiểm tra MongoDB có chạy không
2. Kiểm tra Cloudinary credentials
3. Kiểm tra console browser (F12)
4. Kiểm tra logs backend

### Test API trực tiếp:
Mở file `admin-recruiter/test-api.html` trong trình duyệt để test API upload

## Các endpoint API:

- `POST /admin/recruiters/create-with-avatar` - Tạo recruiter với ảnh
- `POST /admin/recruiters/upload-avatar/:id` - Upload ảnh cho recruiter
- `DELETE /admin/recruiters/delete-avatar/:id` - Xóa ảnh recruiter

## Lưu ý:
- Ảnh phải là JPG/PNG
- Dung lượng tối đa: 2MB
- Ảnh sẽ được resize về 300px width 