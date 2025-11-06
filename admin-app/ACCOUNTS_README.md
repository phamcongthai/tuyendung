# Quản lý tài khoản - Admin Frontend

## Tổng quan

Phần quản lý tài khoản cho phép admin quản lý tất cả tài khoản trong hệ thống, bao gồm:
- Người dùng thông thường
- Nhà tuyển dụng  
- Admin/Moderator

## Tính năng

### 1. Danh sách tài khoản (`/accounts`)
- Hiển thị danh sách tất cả tài khoản
- Tìm kiếm theo email
- Lọc theo trạng thái (hoạt động/không hoạt động)
- Lọc theo vai trò (USER/RECRUITER/ADMIN)
- Thao tác: xem chi tiết, chỉnh sửa, xóa, thay đổi trạng thái, xác thực email

### 2. Tạo tài khoản mới (`/accounts/create`)
- Tạo tài khoản với email và mật khẩu
- Chọn vai trò từ danh sách có sẵn
- Chọn loại hồ sơ (USER/RECRUITER/ADMIN)
- Nhập thông tin chi tiết tùy theo loại hồ sơ

### 3. Xem chi tiết tài khoản (`/accounts/detail/:id`)
- Hiển thị thông tin cơ bản của tài khoản
- Hiển thị danh sách vai trò đã gán
- Hiển thị thông tin chi tiết theo loại hồ sơ
- Nút chỉnh sửa để chuyển đến trang edit

### 4. Chỉnh sửa tài khoản (`/accounts/edit/:id`)
- Cập nhật thông tin cơ bản (email, vai trò, trạng thái)
- Cập nhật thông tin chi tiết theo loại hồ sơ
- Không cho phép thay đổi loại hồ sơ (chỉ edit thông tin)

## Cấu trúc file

```
src/pages/Accounts/
├── index.tsx          # Danh sách tài khoản
├── CreateAccount.tsx  # Tạo tài khoản mới
├── EditAccount.tsx    # Chỉnh sửa tài khoản
├── AccountDetail.tsx  # Chi tiết tài khoản
└── index.ts          # Export các components
```

## API Endpoints

### Accounts
- `GET /admin/accounts` - Lấy danh sách tài khoản
- `GET /admin/accounts/:id` - Lấy thông tin tài khoản
- `GET /admin/accounts/:id/with-roles` - Lấy tài khoản với vai trò
- `POST /admin/accounts` - Tạo tài khoản mới
- `PUT /admin/accounts/:id` - Cập nhật tài khoản
- `DELETE /admin/accounts/:id` - Xóa tài khoản
- `PUT /admin/accounts/:id/status` - Cập nhật trạng thái
- `PUT /admin/accounts/:id/verify-email` - Xác thực email

### Roles
- `GET /admin/roles` - Lấy danh sách vai trò
- `GET /admin/roles/:id` - Lấy thông tin vai trò
- `POST /admin/roles` - Tạo vai trò mới
- `PUT /admin/roles/:id` - Cập nhật vai trò
- `DELETE /admin/roles/:id` - Xóa vai trò

## Cách sử dụng

### 1. Cài đặt dependencies
```bash
npm install dayjs
```

### 2. Truy cập trang quản lý tài khoản
- Vào menu "Quản lý tài khoản" trong sidebar
- Hoặc truy cập trực tiếp `/accounts`

### 3. Tạo tài khoản mới
- Click nút "Tạo tài khoản mới"
- Điền thông tin cơ bản (email, mật khẩu, vai trò)
- Chọn loại hồ sơ
- Điền thông tin chi tiết
- Click "Tạo tài khoản"

### 4. Chỉnh sửa tài khoản
- Click nút "Chỉnh sửa" trong danh sách
- Hoặc click nút "Chỉnh sửa" trong trang chi tiết
- Thay đổi thông tin cần thiết
- Click "Cập nhật tài khoản"

### 5. Xem chi tiết
- Click nút "Xem chi tiết" trong danh sách
- Xem đầy đủ thông tin tài khoản và vai trò

## Lưu ý

1. **Vai trò**: Một tài khoản có thể có nhiều vai trò
2. **Loại hồ sơ**: Không thể thay đổi loại hồ sơ sau khi tạo
3. **Trạng thái**: Có thể bật/tắt tài khoản mà không xóa
4. **Xác thực email**: Admin có thể xác thực email cho tài khoản
5. **Soft delete**: Tài khoản bị xóa sẽ được đánh dấu deleted = true

## Giao diện

- Sử dụng Ant Design components
- Responsive design cho mobile và desktop
- Loading states và error handling
- Confirm dialogs cho các thao tác quan trọng
- Form validation đầy đủ

## Tích hợp

- Tích hợp với backend API qua axios
- Sử dụng React Router cho navigation
- State management với React hooks
- Error handling với SweetAlert2
- Date formatting với dayjs
