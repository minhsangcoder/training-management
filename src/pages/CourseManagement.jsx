import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Filter, BookOpen, Users, Calendar, Clock, Star, GraduationCap } from 'lucide-react'
import { mockCourses, mockCourseCategories, mockCourseSessions, mockEmployees } from '@/services/mockData'
import toast from 'react-hot-toast'

const CourseManagement = () => {
  const [activeTab, setActiveTab] = useState('courses')
  const [courses, setCourses] = useState(mockCourses)
  const [categories, setCategories] = useState(mockCourseCategories)
  const [sessions, setSessions] = useState(mockCourseSessions)
  const [employees] = useState(mockEmployees)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [levelFilter, setLevelFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [selectedItem, setSelectedItem] = useState(null)
  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    description: '',
    category_id: '',
    duration_hours: '',
    credits: '',
    level: 'Beginner',
    prerequisites: '',
    learning_objectives: '',
    created_by: 1
  })

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || course.category_id === parseInt(categoryFilter)
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter
    
    return matchesSearch && matchesCategory && matchesLevel
  })

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.session_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.instructor_name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleCreate = () => {
    setModalType('create')
    setSelectedItem(null)
    setFormData({
      course_code: '',
      course_name: '',
      description: '',
      category_id: '',
      duration_hours: '',
      credits: '',
      level: 'Beginner',
      prerequisites: '',
      learning_objectives: '',
      created_by: 1
    })
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setModalType('edit')
    setSelectedItem(item)
    if (activeTab === 'courses') {
      setFormData({
        course_code: item.course_code,
        course_name: item.course_name,
        description: item.description || '',
        category_id: item.category_id,
        duration_hours: item.duration_hours,
        credits: item.credits,
        level: item.level,
        prerequisites: item.prerequisites || '',
        learning_objectives: item.learning_objectives || '',
        created_by: item.created_by
      })
    } else {
      setFormData({
        session_code: item.session_code,
        course_id: item.course_id,
        instructor_id: item.instructor_id,
        start_date: item.start_date,
        end_date: item.end_date,
        max_students: item.max_students,
        location: item.location || '',
        notes: item.notes || ''
      })
    }
    setShowModal(true)
  }

  const handleDelete = (item) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa ${item.course_name || item.session_code}?`)) {
      if (activeTab === 'courses') {
        setCourses(courses.filter(c => c.id !== item.id))
        toast.success('Xóa học phần thành công!')
      } else {
        setSessions(sessions.filter(s => s.id !== item.id))
        toast.success('Xóa khóa học thành công!')
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (activeTab === 'courses') {
      if (modalType === 'create') {
        const newCourse = {
          id: Date.now(),
          ...formData,
          category_name: categories.find(c => c.id === parseInt(formData.category_id))?.category_name,
          created_by_name: employees.find(e => e.id === formData.created_by)?.full_name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true
        }
        setCourses([...courses, newCourse])
        toast.success('Tạo học phần thành công!')
      } else {
        setCourses(courses.map(c => 
          c.id === selectedItem.id 
            ? { 
                ...c, 
                ...formData, 
                category_name: categories.find(cat => cat.id === parseInt(formData.category_id))?.category_name,
                updated_at: new Date().toISOString() 
              }
            : c
        ))
        toast.success('Cập nhật học phần thành công!')
      }
    } else {
      if (modalType === 'create') {
        const newSession = {
          id: Date.now(),
          ...formData,
          course_name: courses.find(c => c.id === parseInt(formData.course_id))?.course_name,
          instructor_name: employees.find(e => e.id === parseInt(formData.instructor_id))?.full_name,
          current_students: 0,
          status: 'Scheduled',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        setSessions([...sessions, newSession])
        toast.success('Tạo khóa học thành công!')
      } else {
        setSessions(sessions.map(s => 
          s.id === selectedItem.id 
            ? { 
                ...s, 
                ...formData, 
                course_name: courses.find(c => c.id === parseInt(formData.course_id))?.course_name,
                instructor_name: employees.find(e => e.id === parseInt(formData.instructor_id))?.full_name,
                updated_at: new Date().toISOString() 
              }
            : s
        ))
        toast.success('Cập nhật khóa học thành công!')
      }
    }
    
    setShowModal(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800'
      case 'Ongoing': return 'bg-green-100 text-green-800'
      case 'Completed': return 'bg-gray-100 text-gray-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'Scheduled': return 'Đã lên lịch'
      case 'Ongoing': return 'Đang diễn ra'
      case 'Completed': return 'Đã hoàn thành'
      case 'Cancelled': return 'Đã hủy'
      default: return status
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const CourseTable = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="table-header">Mã học phần</th>
            <th className="table-header">Tên học phần</th>
            <th className="table-header">Danh mục</th>
            <th className="table-header">Thời lượng</th>
            <th className="table-header">Tín chỉ</th>
            <th className="table-header">Cấp độ</th>
            <th className="table-header">Người tạo</th>
            <th className="table-header">Thao tác</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredCourses.map((course) => (
            <tr key={course.id} className="hover:bg-gray-50">
              <td className="table-cell font-medium text-blue-600">{course.course_code}</td>
              <td className="table-cell">
                <div>
                  <div className="font-medium text-gray-900">{course.course_name}</div>
                  <div className="text-sm text-gray-500 max-w-xs truncate">{course.description}</div>
                </div>
              </td>
              <td className="table-cell">{course.category_name}</td>
              <td className="table-cell">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-gray-400 mr-1" />
                  {course.duration_hours}h
                </div>
              </td>
              <td className="table-cell">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {course.credits} tín chỉ
                </span>
              </td>
              <td className="table-cell">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                  {course.level}
                </span>
              </td>
              <td className="table-cell">{course.created_by_name}</td>
              <td className="table-cell">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(course)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const SessionTable = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="table-header">Mã khóa học</th>
            <th className="table-header">Tên học phần</th>
            <th className="table-header">Giảng viên</th>
            <th className="table-header">Ngày bắt đầu</th>
            <th className="table-header">Ngày kết thúc</th>
            <th className="table-header">Học viên</th>
            <th className="table-header">Địa điểm</th>
            <th className="table-header">Trạng thái</th>
            <th className="table-header">Thao tác</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredSessions.map((session) => (
            <tr key={session.id} className="hover:bg-gray-50">
              <td className="table-cell font-medium text-blue-600">{session.session_code}</td>
              <td className="table-cell">{session.course_name}</td>
              <td className="table-cell">
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-gray-400 mr-2" />
                  {session.instructor_name}
                </div>
              </td>
              <td className="table-cell">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  {session.start_date}
                </div>
              </td>
              <td className="table-cell">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                  {session.end_date}
                </div>
              </td>
              <td className="table-cell">
                <div className="flex items-center">
                  <GraduationCap className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-sm">
                    {session.current_students}/{session.max_students}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(session.current_students / session.max_students) * 100}%` }}
                  ></div>
                </div>
              </td>
              <td className="table-cell">{session.location}</td>
              <td className="table-cell">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                  {getStatusText(session.status)}
                </span>
              </td>
              <td className="table-cell">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(session)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(session)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý học phần</h1>
          <p className="text-gray-600 mt-2">Quản lý học phần và khóa học trong hệ thống</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm mới</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-full">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng học phần</p>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-full">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Khóa học đang diễn ra</p>
              <p className="text-2xl font-bold text-gray-900">
                {sessions.filter(s => s.status === 'Ongoing').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500 rounded-full">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Sắp bắt đầu</p>
              <p className="text-2xl font-bold text-gray-900">
                {sessions.filter(s => s.status === 'Scheduled').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500 rounded-full">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
              <p className="text-2xl font-bold text-gray-900">
                {sessions.filter(s => s.status === 'Completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('courses')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'courses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            Học phần ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sessions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Calendar className="w-5 h-5 inline mr-2" />
            Khóa học ({sessions.length})
          </button>
        </nav>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
          
          {activeTab === 'courses' ? (
            <>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                ))}
              </select>
              
              <select
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả cấp độ</option>
                <option value="Beginner">Cơ bản</option>
                <option value="Intermediate">Trung cấp</option>
                <option value="Advanced">Nâng cao</option>
              </select>
            </>
          ) : (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Scheduled">Đã lên lịch</option>
              <option value="Ongoing">Đang diễn ra</option>
              <option value="Completed">Đã hoàn thành</option>
              <option value="Cancelled">Đã hủy</option>
            </select>
          )}
        </div>
        
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          <Filter className="w-5 h-5" />
          <span>Bộ lọc nâng cao</span>
        </button>
      </div>

      {/* Table */}
      {activeTab === 'courses' ? <CourseTable /> : <SessionTable />}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {modalType === 'create' 
                  ? `Thêm ${activeTab === 'courses' ? 'học phần' : 'khóa học'} mới`
                  : `Chỉnh sửa ${activeTab === 'courses' ? 'học phần' : 'khóa học'}`
                }
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === 'courses' ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mã học phần *
                        </label>
                        <input
                          type="text"
                          value={formData.course_code}
                          onChange={(e) => setFormData({...formData, course_code: e.target.value})}
                          className="input-field"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Danh mục *
                        </label>
                        <select
                          value={formData.category_id}
                          onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                          className="input-field"
                          required
                        >
                          <option value="">Chọn danh mục</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên học phần *
                      </label>
                      <input
                        type="text"
                        value={formData.course_name}
                        onChange={(e) => setFormData({...formData, course_name: e.target.value})}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mô tả
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        className="input-field"
                        rows="3"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Thời lượng (giờ) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.duration_hours}
                          onChange={(e) => setFormData({...formData, duration_hours: e.target.value})}
                          className="input-field"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số tín chỉ *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.credits}
                          onChange={(e) => setFormData({...formData, credits: e.target.value})}
                          className="input-field"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cấp độ *
                        </label>
                        <select
                          value={formData.level}
                          onChange={(e) => setFormData({...formData, level: e.target.value})}
                          className="input-field"
                          required
                        >
                          <option value="Beginner">Cơ bản</option>
                          <option value="Intermediate">Trung cấp</option>
                          <option value="Advanced">Nâng cao</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Điều kiện tiên quyết
                      </label>
                      <textarea
                        value={formData.prerequisites}
                        onChange={(e) => setFormData({...formData, prerequisites: e.target.value})}
                        className="input-field"
                        rows="2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mục tiêu học tập
                      </label>
                      <textarea
                        value={formData.learning_objectives}
                        onChange={(e) => setFormData({...formData, learning_objectives: e.target.value})}
                        className="input-field"
                        rows="2"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mã khóa học *
                        </label>
                        <input
                          type="text"
                          value={formData.session_code || ''}
                          onChange={(e) => setFormData({...formData, session_code: e.target.value})}
                          className="input-field"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Học phần *
                        </label>
                        <select
                          value={formData.course_id || ''}
                          onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                          className="input-field"
                          required
                        >
                          <option value="">Chọn học phần</option>
                          {courses.map(course => (
                            <option key={course.id} value={course.id}>{course.course_name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giảng viên *
                      </label>
                      <select
                        value={formData.instructor_id || ''}
                        onChange={(e) => setFormData({...formData, instructor_id: e.target.value})}
                        className="input-field"
                        required
                      >
                        <option value="">Chọn giảng viên</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ngày bắt đầu *
                        </label>
                        <input
                          type="date"
                          value={formData.start_date || ''}
                          onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                          className="input-field"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ngày kết thúc *
                        </label>
                        <input
                          type="date"
                          value={formData.end_date || ''}
                          onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                          className="input-field"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số học viên tối đa *
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.max_students || ''}
                          onChange={(e) => setFormData({...formData, max_students: e.target.value})}
                          className="input-field"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Địa điểm
                        </label>
                        <input
                          type="text"
                          value={formData.location || ''}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ghi chú
                      </label>
                      <textarea
                        value={formData.notes || ''}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        className="input-field"
                        rows="3"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {modalType === 'create' ? 'Tạo mới' : 'Cập nhật'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseManagement
