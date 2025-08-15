import React from 'react'
import type { JobCategory } from '../types/models'
import { Card } from 'antd'

type CategoryCardProps = {
  category: JobCategory
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Card className="category-card" hoverable>
      <div className="category-icon" aria-hidden>{category.name.charAt(0)}</div>
      <div className="category-content">
        <div className="category-name">{category.name}</div>
        <div className="category-count">{category.count.toLocaleString()} việc làm</div>
      </div>
    </Card>
  )
}

export default CategoryCard


