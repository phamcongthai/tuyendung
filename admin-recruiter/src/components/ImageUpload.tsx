import React from 'react';
import { Upload, Button, Image } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

interface ImageUploadProps {
  avatarUrl: string;
  avatarFile: File | null;
  onAvatarChange: (info: any) => void;
  onDeleteAvatar: () => void;
  loading?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  avatarUrl,
  avatarFile,
  onAvatarChange,
  onDeleteAvatar,
  loading = false,
}) => {
  return (
    <div style={{ textAlign: 'center' }}>
      {avatarUrl && (
        <div style={{ marginBottom: 16 }}>
          <Image
            width={120}
            src={avatarUrl}
            alt="avatar"
            preview={false}
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ marginTop: 8 }}>
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={onDeleteAvatar}
              disabled={loading}
            >
              Xóa ảnh
            </Button>
          </div>
        </div>
      )}

      <Upload
        name="avatar"
        accept="image/*"
        showUploadList={false}
        beforeUpload={() => false} // không upload tự động
        onChange={onAvatarChange}
      >
        <Button icon={<PlusOutlined />} disabled={loading}>
          {avatarUrl ? 'Thay ảnh' : 'Tải ảnh lên'}
        </Button>
      </Upload>
    </div>
  );
};

export default ImageUpload;
