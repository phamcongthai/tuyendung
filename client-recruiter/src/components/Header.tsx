import React from 'react'
import { Layout, Menu, Button } from 'antd'

type HeaderProps = {
  onNavigate?: (path: string) => void
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <Layout.Header className="site-header" style={{ background: '#ffffff', padding: 0 }}>
      <div className="container header-inner">
        <div className="brand" onClick={() => onNavigate?.('/')}>TopJobs</div>
        <Menu
          mode="horizontal"
          selectable={false}
          className="nav"
          items={[
            { key: 'jobs', label: <a href="#jobs" onClick={(e) => { e.preventDefault(); onNavigate?.('#jobs') }}>Việc làm</a> },
            { key: 'companies', label: <a href="#companies" onClick={(e) => { e.preventDefault(); onNavigate?.('#companies') }}>Công ty</a> },
            { key: 'cv', label: <a href="#" onClick={(e) => e.preventDefault()}>CV</a> },
            { key: 'blog', label: <a href="#" onClick={(e) => e.preventDefault()}>Blog</a> }
          ]}
        />
        <div className="actions">
          <Button type="default" onClick={() => onNavigate?.('/login')}>Đăng nhập</Button>
          <Button type="primary" onClick={() => onNavigate?.('/register')}>Đăng ký</Button>
        </div>
      </div>
    </Layout.Header>
  )
}

export default Header


