import React from 'react'
import type { Company } from '../types/models'
import { Card, Tag } from 'antd'

type CompanyCardProps = {
  company: Company
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <Card className="company-card" hoverable>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div className="company-logo" aria-hidden>{company.logoText ?? company.name.charAt(0)}</div>
        <div className="company-info">
          <div className="company-name">{company.name}</div>
          {company.location && <div className="company-location">{company.location}</div>}
          {company.hot && <Tag color="#d1fae5" style={{ color: '#065f46' }}>Hot</Tag>}
        </div>
      </div>
    </Card>
  )
}

export default CompanyCard


