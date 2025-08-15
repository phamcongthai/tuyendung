import React, { useState } from 'react'
import { Input, Button, Tag } from 'antd'

type HeroSearchProps = {
  onSearch?: (keyword: string, location: string) => void
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(keyword.trim(), location.trim())
  }

  const quickTags = ['Thực tập', 'Backend', 'Frontend', 'Java', 'Tester', 'Kế toán']

  return (
    <section className="hero">
      <div className="container">
        <h1>Việc làm tốt, lương cao cho bạn</h1>
        <p>Tìm công việc mơ ước với hàng ngàn tin tuyển dụng mỗi ngày</p>
        <form className="search-bar" onSubmit={handleSubmit}>
          <div className="input-group">
            <Input
              placeholder="Vị trí, kỹ năng, công ty..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              size="large"
            />
          </div>
          <div className="input-group">
            <Input
              placeholder="Địa điểm (VD: Hà Nội, TP.HCM)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              size="large"
            />
          </div>
          <Button type="primary" htmlType="submit" size="large">Tìm kiếm</Button>
        </form>
        <div className="quick-tags">
          {quickTags.map((tag) => (
            <Tag key={tag} color="#d1fae5" style={{ color: '#065f46', cursor: 'pointer' }} onClick={() => setKeyword(tag)}>
              {tag}
            </Tag>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSearch


