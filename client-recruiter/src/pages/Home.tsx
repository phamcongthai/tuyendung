import React, { useMemo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import HeroSearch from '../components/HeroSearch'
import JobCard from '../components/JobCard'
import CompanyCard from '../components/CompanyCard'
import CategoryCard from '../components/CategoryCard'
import { Layout, Row, Col, Tag, Button, Empty } from 'antd'
import { FireOutlined, EyeOutlined, ClockCircleOutlined, EnvironmentOutlined, DollarOutlined, PlusOutlined } from '@ant-design/icons'
import HotJobCardSkeleton from '../components/skeleton/HotJobCardSkeleton'
import type { Company, JobData, JobCategory } from '../types/models'
import { fetchJobs } from '../apis/jobs.api' // ✅ import từ api.ts

const placeholderCompanies: Company[] = [
  { id: 'c1', name: 'VietTech Solutions', logoText: 'VT', hot: true, location: 'Hà Nội' },
  { id: 'c2', name: 'Saigon Digital', logoText: 'SD', hot: true, location: 'TP.HCM' },
  { id: 'c3', name: 'North Star', logoText: 'NS', location: 'Đà Nẵng' },
  { id: 'c4', name: 'Alpha Labs', logoText: 'AL', location: 'Hà Nội' },
  { id: 'c5', name: 'Blue Ocean', logoText: 'BO', location: 'TP.HCM' }
]

const categories: JobCategory[] = [
  { id: 'ct1', name: 'Frontend', count: 312 },
  { id: 'ct2', name: 'Backend', count: 287 },
  { id: 'ct3', name: 'Tester/QA', count: 142 },
  { id: 'ct4', name: 'Data', count: 96 },
  { id: 'ct5', name: 'Mobile', count: 121 },
  { id: 'ct6', name: 'HR/Recruitment', count: 78 }
]

const Home: React.FC = () => {
  const navigate = useNavigate()
  const highlightedCompanies = useMemo(() => placeholderCompanies.slice(0, 4), [])
  const [loadingHotJobs, setLoadingHotJobs] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hotJobs, setHotJobs] = useState<JobData[]>([])
  const [displayedJobs, setDisplayedJobs] = useState<JobData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalJobs, setTotalJobs] = useState(0)

  useEffect(() => {
    const getHotJobs = async () => {
      setLoadingHotJobs(true)
      try {
        const { data, total } = await fetchJobs({ page: 1, limit: 6 }) // ✅ dùng fetchJobs từ api.ts
        setHotJobs(data)
        setDisplayedJobs(data)
        setTotalJobs(total)
        setHasMore(data.length === 6 && total > 6)
      } catch (error) {
        console.error('Failed to fetch hot jobs:', error)
        setHotJobs([])
        setDisplayedJobs([])
      } finally {
        setLoadingHotJobs(false)
      }
    }
    getHotJobs()
  }, [])

  const loadMoreJobs = async () => {
    if (loadingMore || !hasMore) return
    
    setLoadingMore(true)
    try {
      const nextPage = currentPage + 1
      const { data, total } = await fetchJobs({ page: nextPage, limit: 6 })
      
      if (data.length > 0) {
        setDisplayedJobs(prev => [...prev, ...data])
        setCurrentPage(nextPage)
        setHasMore(displayedJobs.length + data.length < total)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Failed to load more jobs:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  const formatSalary = (job: JobData) => {
    if (job.salaryNegotiable) return "Thỏa thuận";
    if (job.salaryMin && job.salaryMax) {
      return `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} ${job.salaryType || "VNĐ"}`;
    }
    if (job.salaryMin) {
      return `Từ ${job.salaryMin.toLocaleString()} ${job.salaryType || "VNĐ"}`;
    }
    if (job.salaryMax) {
      return `Đến ${job.salaryMax.toLocaleString()} ${job.salaryType || "VNĐ"}`;
    }
    return "Không rõ";
  };

  const getJobTypeColor = (jobType?: string) => {
    switch (jobType?.toLowerCase()) {
      case 'fulltime':
      case 'full-time':
        return 'green';
      case 'parttime':
      case 'part-time':
        return 'orange';
      case 'internship':
        return 'blue';
      case 'contract':
        return 'purple';
      default:
        return 'default';
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'junior':
        return 'blue';
      case 'middle':
      case 'mid':
        return 'orange';
      case 'senior':
        return 'red';
      case 'lead':
      case 'manager':
        return 'purple';
      default:
        return 'default';
    }
  };

  const handleJobClick = (job: JobData) => {
    navigate(`/jobs/${job.slug}`)
  }

  return (
    <Layout>
      <Header />
      <Layout.Content>
        <HeroSearch onSearch={() => { /* API để trống theo yêu cầu */ }} />

        {/* Hot Jobs Section - Improved Design */}
        <section className="section hot-jobs-section" id="jobs" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '60px 0',
          position: 'relative'
        }}>
          <div className="container">
            {/* Section Header */}
            <div className="section-head" style={{ 
              textAlign: 'center', 
              marginBottom: '40px',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
                <FireOutlined style={{ fontSize: '32px', color: '#ff6b35' }} />
                <h2 style={{ 
                  fontSize: '36px', 
                  fontWeight: '700', 
                  margin: 0,
                  background: 'linear-gradient(45deg, #fff, #f0f0f0)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  Việc làm hot
                </h2>
              </div>
              <p style={{ 
                fontSize: '18px', 
                opacity: 0.9, 
                margin: 0,
                fontWeight: '300'
              }}>
                Những cơ hội việc làm hấp dẫn nhất đang chờ bạn
              </p>
            </div>

            {/* Jobs Grid - 3 columns, 2 rows initially */}
            <Row gutter={[20, 20]}>
              {loadingHotJobs
                ? Array.from({ length: 6 }).map((_, idx) => (
                    <Col key={idx} xs={24} sm={12} md={8} lg={8}>
                      <HotJobCardSkeleton />
                    </Col>
                  ))
                : displayedJobs.length > 0
                ? displayedJobs.map((job) => (
                    <Col key={job._id} xs={24} sm={12} md={8} lg={8}>
                      <div 
                        onClick={() => handleJobClick(job)}
                        style={{
                          background: 'white',
                          borderRadius: '12px',
                          padding: '16px',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                          border: '1px solid #f0f0f0',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
                        }}
                      >
                        {/* Hot Badge */}
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'linear-gradient(45deg, #ff6b35, #f7931e)',
                          color: 'white',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          <FireOutlined style={{ fontSize: '10px' }} />
                          HOT
                        </div>

                        {/* Company Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            flexShrink: 0
                          }}>
                            {job.images?.[0] ? (
                              <img 
                                src={job.images[0]} 
                                alt={job.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                              />
                            ) : (
                              job.title.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h3 style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              margin: '0 0 4px 0',
                              color: '#1a1a1a',
                              lineHeight: '1.3',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {job.title}
                            </h3>
                            <p style={{
                              fontSize: '12px',
                              color: '#666',
                              margin: 0,
                              fontWeight: '500',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {job.career || 'Chưa xác định'}
                            </p>
                          </div>
                        </div>

                        {/* Salary */}
                        <div style={{
                          background: 'linear-gradient(135deg, #f8f9ff, #e8f2ff)',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          marginBottom: '10px',
                          border: '1px solid #e3f2fd'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <DollarOutlined style={{ color: '#2196f3', fontSize: '12px' }} />
                            <span style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#1976d2'
                            }}>
                              {formatSalary(job)}
                            </span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {job.jobType && (
                            <Tag color={getJobTypeColor(job.jobType)} style={{ borderRadius: '4px', fontWeight: '500', fontSize: '10px', padding: '2px 6px' }}>
                              {job.jobType}
                            </Tag>
                          )}
                          {job.level && (
                            <Tag color={getLevelColor(job.level)} style={{ borderRadius: '4px', fontWeight: '500', fontSize: '10px', padding: '2px 6px' }}>
                              {job.level}
                            </Tag>
                          )}
                          {job.skills?.slice(0, 1).map((skill) => (
                            <Tag key={skill} style={{ 
                              background: '#f5f5f5', 
                              color: '#666', 
                              border: '1px solid #e0e0e0',
                              borderRadius: '4px',
                              fontWeight: '500',
                              fontSize: '10px',
                              padding: '2px 6px'
                            }}>
                              {skill}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    </Col>
                  ))
                : (
                    <Col span={24}>
                      <Empty 
                        description="Không có việc làm nào được tìm thấy"
                        style={{ 
                          background: 'white', 
                          borderRadius: '16px', 
                          padding: '40px',
                          margin: '20px 0'
                        }}
                      />
                    </Col>
                  )}
            </Row>

            {/* Load More Button */}
            {hasMore && !loadingHotJobs && (
              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <Button 
                  size="large"
                  loading={loadingMore}
                  onClick={loadMoreJobs}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    borderRadius: '12px',
                    padding: '12px 32px',
                    fontSize: '16px',
                    fontWeight: '600',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                  }}
                  icon={<PlusOutlined />}
                >
                  {loadingMore ? 'Đang tải...' : 'Xem thêm việc làm'}
                </Button>
              </div>
            )}

            {/* View All Button */}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <Button 
                size="large"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: '2px solid rgba(255,255,255,0.25)',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '12px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                }}
              >
                Xem tất cả việc làm ({totalJobs})
              </Button>
            </div>
          </div>
        </section>

        <section className="section" id="categories">
          <div className="container">
            <div className="section-head">
              <h2>Ngành nghề nổi bật</h2>
              <a href="#" onClick={(e) => e.preventDefault()} className="link">Xem tất cả</a>
            </div>
            <Row gutter={[14, 14]}>
              {categories.map((c) => (
                <Col key={c.id} xs={24} sm={12} md={12} lg={8}>
                  <CategoryCard category={c} />
                </Col>
              ))}
            </Row>
          </div>
        </section>

        <section className="section" id="companies">
          <div className="container">
            <div className="section-head">
              <h2>Công ty nổi bật</h2>
              <a href="#" onClick={(e) => e.preventDefault()} className="link">Xem tất cả</a>
            </div>
            <Row gutter={[14, 14]}>
              {highlightedCompanies.map((c) => (
                <Col key={c.id} xs={24} sm={12} md={12} lg={6}>
                  <CompanyCard company={c} />
                </Col>
              ))}
            </Row>
          </div>
        </section>

        <section className="cta">
          <div className="container cta-inner">
            <div>
              <h3>Tải CV của bạn để được gợi ý việc làm phù hợp</h3>
              <p>Hệ thống đề xuất thông minh giúp bạn tiếp cận đúng công việc mơ ước.</p>
            </div>
            <a className="btn btn-secondary" href="#" onClick={(e) => e.preventDefault()}>Tải CV ngay</a>
          </div>
        </section>
      </Layout.Content>
      <Footer />
    </Layout>
  )
}

export default Home
