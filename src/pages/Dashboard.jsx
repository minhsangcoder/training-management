import React, { useState, useEffect } from 'react'
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { mockStats, mockCourseSessions, mockEnrollments } from '@/services/mockData'

const Dashboard = () => {
  const [stats, setStats] = useState(mockStats)
  const [upcomingCourses, setUpcomingCourses] = useState([])
  const [recentEnrollments, setRecentEnrollments] = useState([])

  useEffect(() => {
    // Simulate API calls
    setUpcomingCourses(mockCourseSessions.slice(0, 3))
    setRecentEnrollments(mockEnrollments.slice(0, 5))
  }, [])

  const statCards = [
    {
      title: 'Tổng số phòng ban',
      value: stats.totalDepartments,
      icon: Users,
      color: 'bg-blue-500',
      change: '+2',
      changeType: 'positive'
    },
    {
      title: 'Tổng số nhân viên',
      value: stats.totalEmployees,
      icon: Users,
      color: 'bg-green-500',
      change: '+12',
      changeType: 'positive'
    },
    {
      title: 'Tổng số học phần',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'bg-purple-500',
      change: '+3',
      changeType: 'positive'
    },
    {
      title: 'Tổng số đăng ký',
      value: stats.totalEnrollments,
      icon: GraduationCap,
      color: 'bg-orange-500',
      change: '+45',
      changeType: 'positive'
    }
  ]

  const functionalModules = [
    {
      title: 'Xin xác nhận',
      icon: '👨‍🎓👩‍💻',
      color: 'border-blue-500',
      description: 'Xác nhận thông tin học tập'
    },
    {
      title: 'Thư viện',
      icon: '📚',
      color: 'border-blue-300',
      description: 'Truy cập tài liệu học tập'
    },
    {
      title: 'Tài chính',
      icon: '💰',
      color: 'border-orange-500',
      description: 'Quản lý học phí và thanh toán'
    },
    {
      title: 'Lịch học',
      icon: '📅',
      color: 'border-red-500',
      description: 'Xem thời khóa biểu'
    },
    {
      title: 'Đăng ký học',
      icon: '👨‍🎓👩‍💻',
      color: 'border-red-500',
      description: 'Đăng ký môn học'
    },
    {
      title: 'Thông tin chỗ ở',
      icon: '🏢',
      color: 'border-green-500',
      description: 'Quản lý ký túc xá'
    },
    {
      title: 'Tự nhập hồ sơ',
      icon: '💻',
      color: 'border-red-500',
      description: 'Cập nhật thông tin cá nhân'
    }
  ]

  const newsItems = [
    {
      id: 1,
      title: 'Thông báo Về việc công nhận kết quả học tập và chuyển đổi tín chỉ K19 năm học 2025-2026',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Thông báo Vv Không chấp nhận chứng chỉ TOEFL IBT Home Edition trong việc xét chuẩn đầu ra ngoại ngữ',
      date: '2024-01-10'
    },
    {
      id: 3,
      title: 'Thông báo về việc đăng ký học đăng ký học Đợt 2 Học kỳ 1 năm học 2025-2026',
      date: '2024-01-05'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Tổng quan hệ thống quản lý đào tạo</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Functional Modules */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Chức năng hệ thống</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {functionalModules.map((module, index) => (
            <div key={index} className={`card border-l-4 ${module.color} hover:shadow-lg transition-shadow duration-200 cursor-pointer`}>
              <div className="text-center">
                <div className="text-4xl mb-3">{module.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-sm text-gray-600">{module.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* News Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-1 h-8 bg-orange-500 mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-900">Tin tức</h2>
          </div>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            Xem tất cả
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((news) => (
            <div key={news.id} className="card relative">
              <div className="absolute top-4 right-4">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-yellow-800">TB</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <div className="pr-12">
                <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-3">
                  {news.title}
                </h3>
                <p className="text-xs text-gray-500">{news.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Courses */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            Khóa học sắp bắt đầu
          </h3>
          <div className="space-y-3">
            {upcomingCourses.map((course) => (
              <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{course.course_name}</h4>
                  <p className="text-sm text-gray-600">{course.instructor_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{course.start_date}</p>
                  <p className="text-xs text-gray-500">{course.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            Đăng ký gần đây
          </h3>
          <div className="space-y-3">
            {recentEnrollments.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{enrollment.employee_name}</h4>
                  <p className="text-sm text-gray-600">{enrollment.course_name}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    enrollment.status === 'Enrolled' 
                      ? 'bg-blue-100 text-blue-800'
                      : enrollment.status === 'Completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {enrollment.status === 'Enrolled' ? 'Đã đăng ký' : 
                     enrollment.status === 'Completed' ? 'Hoàn thành' : enrollment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <div className="fixed bottom-6 right-6">
        <button className="w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200">
          <span className="text-xl">🧠</span>
        </button>
      </div>
    </div>
  )
}

export default Dashboard
