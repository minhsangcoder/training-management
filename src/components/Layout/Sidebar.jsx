import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Newspaper, 
  User, 
  BookOpen, 
  GraduationCap,
  Calendar, 
  FileText,
  ChevronRight,
  Users,
  ClipboardList,
  BarChart3,
  Award,
  Clock,
  UserCheck,
  Settings
} from 'lucide-react'

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation()

  const mainMenuItems = [
    { path: '/', label: 'Trang chủ', icon: Home },
    { path: '/news', label: 'Tin tức', icon: Newspaper },
    { path: '/profile', label: 'Profile', icon: User },
  ]

  const trainingManagementItems = [
    { path: '/programs', label: 'Chương trình đào tạo', icon: GraduationCap },
    { path: '/subjects', label: 'Học phần & môn học', icon: BookOpen },
    { path: '/curriculum', label: 'Khung chương trình', icon: FileText },
    { path: '/outcomes', label: 'Chuẩn đầu ra', icon: Award },
  ]

  const studentManagementItems = [
    { path: '/students', label: 'Danh sách sinh viên', icon: Users },
    { path: '/registrations', label: 'Đăng ký học', icon: ClipboardList },
    { path: '/transfers', label: 'Chuyển ngành/chuyển trường', icon: UserCheck },
    { path: '/graduation', label: 'Xét tốt nghiệp', icon: Award },
  ]

  const managementItems = [
    { path: '/departments', label: 'Quản lý cơ cấu tổ chức', icon: Settings },
    { path: '/employees', label: 'Quản lý nhân viên', icon: Users },
    { path: '/courses', label: 'Quản lý học phần', icon: BookOpen },
  ]

  const teacherManagementItems = [
    { path: '/teachers', label: 'Danh sách giảng viên', icon: UserCheck },
    { path: '/assignments', label: 'Phân công giảng dạy', icon: ClipboardList },
    { path: '/workload', label: 'Khối lượng công việc', icon: BarChart3 },
  ]

  const scheduleManagementItems = [
    { path: '/timetable', label: 'Thời khóa biểu', icon: Calendar },
    { path: '/exams', label: 'Lịch thi', icon: Clock },
    { path: '/rooms', label: 'Phòng học', icon: Home },
    { path: '/sessions', label: 'Ca học/Ca thi', icon: Calendar },
  ]

  const reportsItems = [
    { path: '/academic-reports', label: 'Kết quả học tập', icon: BarChart3 },
    { path: '/graduation-rate', label: 'Tỷ lệ tốt nghiệp', icon: Award },
    { path: '/program-evaluation', label: 'Đánh giá chương trình', icon: FileText },
    { path: '/periodic-reports', label: 'Báo cáo định kỳ', icon: ClipboardList },
  ]

  const systemItems = [
    { path: '/study-settings', label: 'Thông số học tập', icon: Settings },
    { path: '/regulations', label: 'Quy định đào tạo', icon: FileText },
    { path: '/system-config', label: 'Cấu hình hệ thống', icon: Settings },
  ]

  const handleNavigation = (path) => {
    if (window.innerWidth < 1024) {
      onToggle()
    }
  }

  const MenuSection = ({ title, items, className = "" }) => (
    <div className={`space-y-1 ${className}`}>
      {title && (
        <h3 className="px-4 text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">
          {title}
        </h3>
      )}
      {items.map((item) => {
        const Icon = item.icon
        const isActive = location.pathname === item.path
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-blue-100 hover:bg-blue-700 hover:text-white'
            }`}
            onClick={() => handleNavigation(item.path)}
          >
            <Icon className="w-5 h-5 mr-3" />
            <span className="flex-1 text-left">{item.label}</span>
            <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
              isActive ? 'transform translate-x-1' : ''
            }`} />
          </Link>
        )
      })}
    </div>
  )

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-blue-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 bg-blue-900">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-white font-bold text-sm">PHENIKAA UNIVERSITY</span>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden text-white hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Info */}
          <div className="px-4 py-3 bg-blue-700 border-b border-blue-600">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">PT</span>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Phòng Đào Tạo</p>
                <p className="text-blue-200 text-xs">Quản lý cấp cao</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-4 overflow-y-auto" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#93c5fd #1e40af'
          }}>
            {/* Main Menu */}
            <MenuSection items={mainMenuItems} />

            {/* Training Management */}
            <MenuSection 
              title="Quản lý đào tạo" 
              items={trainingManagementItems}
              className="pt-4 border-t border-blue-700"
            />

            {/* Student Management */}
            <MenuSection 
              title="Quản lý sinh viên" 
              items={studentManagementItems}
              className="pt-4 border-t border-blue-700"
            />

            {/* Management Items - Giữ nguyên từ code cũ */}
            <MenuSection 
              title="Quản lý hệ thống" 
              items={managementItems}
              className="pt-4 border-t border-blue-700"
            />

            {/* Teacher Management */}
            <MenuSection 
              title="Quản lý giảng viên" 
              items={teacherManagementItems}
              className="pt-4 border-t border-blue-700"
            />

            {/* Schedule Management */}
            <MenuSection 
              title="Lịch học & Thi" 
              items={scheduleManagementItems}
              className="pt-4 border-t border-blue-700"
            />

            {/* Reports */}
            <MenuSection 
              title="Báo cáo & Thống kê" 
              items={reportsItems}
              className="pt-4 border-t border-blue-700"
            />

            {/* System Settings */}
            <MenuSection 
              title="Cài đặt hệ thống" 
              items={systemItems}
              className="pt-4 border-t border-blue-700"
            />
          </nav>

          {/* Quick Actions */}
          <div className="px-4 py-3 bg-blue-700 border-t border-blue-600">
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleNavigation('/quick-approve')}
                className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors duration-200"
              >
                ⚡ Duyệt nhanh
              </button>
              <button 
                onClick={() => handleNavigation('/emergency-notice')}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors duration-200"
              >
                🚨 Thông báo
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-blue-900 border-t border-blue-700">
            <div className="text-center">
              <p className="text-blue-200 text-xs">Phiên bản 2.1.0</p>
              <p className="text-blue-300 text-xs mt-1">© 2024 Phenikaa University</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar