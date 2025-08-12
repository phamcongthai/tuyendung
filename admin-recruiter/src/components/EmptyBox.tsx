import React from 'react';
import Lottie from 'lottie-react';
import emptyBoxAnimation from '../assets/xsXIvqQ7tL.json'; // ✅ import đúng từ src

const EmptyBox = () => (
  <div style={{ textAlign: 'center', padding: '60px 0' }}>
    <Lottie
      animationData={emptyBoxAnimation}
      loop
      style={{ height: 240, maxWidth: 400, margin: '0 auto' }}
    />
    <p style={{ marginTop: 16, color: '#777' }}>Không có dữ liệu để hiển thị</p>
  </div>
);

export default EmptyBox;
