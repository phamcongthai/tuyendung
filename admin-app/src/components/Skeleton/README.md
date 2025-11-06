# Skeleton Components

Bộ skeleton components được tạo ra để cải thiện trải nghiệm người dùng trong quá trình loading.

## Các Components

### 1. DashboardSkeleton
Skeleton cho trang Dashboard với các thống kê, biểu đồ và hoạt động gần đây.

```tsx
import { DashboardSkeleton } from '../components/Skeleton';

// Sử dụng
if (loading) {
  return <DashboardSkeleton />;
}
```

### 2. TableSkeleton
Skeleton cho các bảng dữ liệu với tùy chọn hiển thị header, search và actions.

```tsx
import { TableSkeleton } from '../components/Skeleton';

// Sử dụng với tùy chọn
<TableSkeleton 
  rowCount={8} 
  showHeader={true} 
  showSearch={true} 
  showActions={true} 
/>
```

**Props:**
- `rowCount`: Số dòng skeleton (mặc định: 5)
- `showHeader`: Hiển thị header skeleton (mặc định: true)
- `showSearch`: Hiển thị search skeleton (mặc định: true)
- `showActions`: Hiển thị actions skeleton (mặc định: true)

### 3. FormSkeleton
Skeleton cho các form với số lượng field có thể tùy chỉnh.

```tsx
import { FormSkeleton } from '../components/Skeleton';

// Sử dụng với tùy chọn
<FormSkeleton fieldCount={8} showTitle={true} />
```

**Props:**
- `fieldCount`: Số lượng field skeleton (mặc định: 8)
- `showTitle`: Hiển thị title skeleton (mặc định: true)

### 4. DetailSkeleton
Skeleton cho trang chi tiết với layout 2 cột.

```tsx
import { DetailSkeleton } from '../components/Skeleton';

// Sử dụng
<DetailSkeleton showActions={true} />
```

**Props:**
- `showActions`: Hiển thị action buttons skeleton (mặc định: true)

### 5. SidebarSkeleton
Skeleton cho sidebar menu.

```tsx
import { SidebarSkeleton } from '../components/Skeleton';

// Sử dụng
<SidebarSkeleton />
```

### 6. LayoutSkeleton
Skeleton cho toàn bộ layout bao gồm sidebar và content.

```tsx
import { LayoutSkeleton } from '../components/Skeleton';

// Sử dụng với content tùy chỉnh
<LayoutSkeleton>
  <DashboardSkeleton />
</LayoutSkeleton>

// Hoặc sử dụng content mặc định
<LayoutSkeleton />
```

## Cách sử dụng

1. Import skeleton component cần thiết
2. Sử dụng trong điều kiện loading
3. Tùy chỉnh props theo nhu cầu

## Ví dụ thực tế

```tsx
import React, { useState, useEffect } from 'react';
import { TableSkeleton } from '../components/Skeleton';

const MyComponent = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData().then(() => setLoading(false));
  }, []);

  if (loading) {
    return <TableSkeleton rowCount={10} />;
  }

  return (
    // Your actual content
  );
};
```

## Lưu ý

- Tất cả skeleton components đều sử dụng Ant Design Skeleton
- Các skeleton được thiết kế để phù hợp với layout hiện tại
- Có thể tùy chỉnh thêm style và props theo nhu cầu cụ thể 