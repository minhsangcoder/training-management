import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Newspaper, 
  User, 
  BookOpen, 
  Grid3X3, 
  Calendar, 
  DollarSign, 
  FileText,
  ChevronRight
} from 'lucide-react'

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation()

  const menuItems = [
    { path: '/', label: 'Trang chủ', icon: Home },
    { path: '/news', label: 'Tin tức', icon: Newspaper },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/learning', label: 'Góc học tập', icon: BookOpen },
    { path: '/registration', label: 'Đăng ký trực tuyến', icon: Grid3X3 },
    { path: '/schedule', label: 'Thời khóa biểu', icon: Calendar },
    { path: '/finance', label: 'Tài chính', icon: DollarSign },
    { path: '/documents', label: 'Văn bản', icon: FileText },
  ]

  const managementItems = [
    { path: '/departments', label: 'Quản lý cơ cấu tổ chức', icon: Grid3X3 },
    { path: '/employees', label: 'Quản lý nhân viên', icon: User },
    { path: '/courses', label: 'Quản lý học phần', icon: BookOpen },
  ]

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

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {/* Main Menu */}
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                    onClick={() => window.innerWidth < 1024 && onToggle()}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )
              })}
            </div>

            {/* Management Section */}
            <div className="pt-4 border-t border-blue-700">
              <h3 className="px-4 text-xs font-semibold text-blue-200 uppercase tracking-wider mb-2">
                Quản lý hệ thống
              </h3>
              <div className="space-y-1">
                {managementItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`sidebar-item ${isActive ? 'active' : ''}`}
                      onClick={() => window.innerWidth < 1024 && onToggle()}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="flex-1">{item.label}</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )
                })}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Sidebar
