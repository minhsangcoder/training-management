import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Filter, Users, Calendar, BookOpen, User, Clock } from 'lucide-react'
import { cohortAPI, courseAPI, employeeAPI } from '@/services/api'
import toast from 'react-hot-toast'

const CohortManagement = () => {
  const [cohorts, setCohorts] = useState([])
  const [courses, setCourses] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [selectedCohort, setSelectedCohort] = useState(null)
  const [formData, setFormData] = useState({
    cohort_code: '',
    cohort_name: '',
    description: '',
    start_date: '',
    end_date: '',
    max_students: 30,
    current_students: 0,
    status: 'planning',
    course_id: '',
    instructor_id: ''
  })

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [cohortsRes, coursesRes, employeesRes] = await Promise.all([
        cohortAPI.getAll(),
        courseAPI.getAll(),
        employeeAPI.getAll()
      ])
      
      setCohorts(cohortsRes.data)
      setCourses(coursesRes.data)
      setEmployees(employeesRes.data)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredCohorts = cohorts.filter(cohort => {
    const matchesSearch = 
      cohort.cohort_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cohort.cohort_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cohort.Course?.course_name && cohort.Course.course_name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || cohort.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleCreate = () => {
    setModalType('create')
    setSelectedCohort(null)
    setFormData({
      cohort_code: '',
      cohort_name: '',
      description: '',
      start_date: '',
      end_date: '',
      max_students: 30,
      current_students: 0,
      status: 'planning',
      course_id: '',
      instructor_id: ''
    })
    setShowModal(true)
  }

  const handleEdit = (cohort) => {
    setModalType('edit')
    setSelectedCohort(cohort)
    setFormData({
      cohort_code: cohort.cohort_code,
      cohort_name: cohort.cohort_name,
      description: cohort.description || '',
      start_date: cohort.start_date,
      end_date: cohort.end_date || '',
      max_students: cohort.max_students,
      current_students: cohort.current_students,
      status: cohort.status,
      course_id: cohort.course_id || '',
      instructor_id: cohort.instructor_id || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (cohort) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa lớp học ${cohort.cohort_name}?`)) {
      try {
        await cohortAPI.delete(cohort.id)
        await loadData() // Reload data
        toast.success('Xóa lớp học thành công!')
      } catch (error) {
        toast.error(error.message)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (modalType === 'create') {
        await cohortAPI.create(formData)
        toast.success('Tạo lớp học thành công!')
      } else {
        await cohortAPI.update(selectedCohort.id, formData)
        toast.success('Cập nhật lớp học thành công!')
      }
      
      await loadData() // Reload data
      setShowModal(false)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'planning': return 'Đang lên kế hoạch'
      case 'active': return 'Đang diễn ra'
      case 'completed': return 'Đã hoàn thành'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xác định'
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const getProgressPercentage = (current, max) => {
    if (max === 0) return 0
    return Math.round((current / max) * 100)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý lớp học</h1>
          <p className="text-gray-600 mt-2">Quản lý các lớp học và khóa đào tạo</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm lớp học</span>
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
              <p className="text-sm font-medium text-gray-600">Tổng lớp học</p>
              <p className="text-2xl font-bold text-gray-900">{cohorts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang diễn ra</p>
              <p className="text-2xl font-bold text-gray-900">
                {cohorts.filter(c => c.status === 'active').length}
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
              <p className="text-sm font-medium text-gray-600">Đang lên kế hoạch</p>
              <p className="text-2xl font-bold text-gray-900">
                {cohorts.filter(c => c.status === 'planning').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-gray-500 rounded-full">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
              <p className="text-2xl font-bold text-gray-900">
                {cohorts.filter(c => c.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm lớp học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="planning">Đang lên kế hoạch</option>
            <option value="active">Đang diễn ra</option>
            <option value="completed">Đã hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
        
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          <Filter className="w-5 h-5" />
          <span>Bộ lọc nâng cao</span>
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Mã lớp</th>
                <th className="table-header">Tên lớp học</th>
                <th className="table-header">Khóa học</th>
                <th className="table-header">Giảng viên</th>
                <th className="table-header">Thời gian</th>
                <th className="table-header">Số học viên</th>
                <th className="table-header">Trạng thái</th>
                <th className="table-header">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCohorts.map((cohort) => (
                <tr key={cohort.id} className="hover:bg-gray-50">
                  <td className="table-cell font-medium text-blue-600">{cohort.cohort_code}</td>
                  <td className="table-cell">
                    <div>
                      <div className="font-medium text-gray-900">{cohort.cohort_name}</div>
                      {cohort.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">{cohort.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    {cohort.Course ? (
                      <div>
                        <div className="font-medium text-gray-900">{cohort.Course.course_name}</div>
                        <div className="text-sm text-gray-500">{cohort.Course.course_code}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Chưa gán khóa học</span>
                    )}
                  </td>
                  <td className="table-cell">
                    {cohort.Instructor ? (
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {cohort.Instructor.first_name} {cohort.Instructor.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{cohort.Instructor.email}</div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Chưa gán giảng viên</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <div className="text-sm">
                      <div className="flex items-center text-gray-900">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(cohort.start_date)}
                      </div>
                      {cohort.end_date && (
                        <div className="flex items-center text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(cohort.end_date)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{cohort.current_students}/{cohort.max_students}</span>
                        <span className="text-gray-500">{getProgressPercentage(cohort.current_students, cohort.max_students)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${getProgressPercentage(cohort.current_students, cohort.max_students)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(cohort.status)}`}>
                      {getStatusText(cohort.status)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(cohort)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cohort)}
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
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {modalType === 'create' ? 'Thêm lớp học mới' : 'Chỉnh sửa thông tin lớp học'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã lớp học *
                    </label>
                    <input
                      type="text"
                      value={formData.cohort_code}
                      onChange={(e) => setFormData({...formData, cohort_code: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên lớp học *
                    </label>
                    <input
                      type="text"
                      value={formData.cohort_name}
                      onChange={(e) => setFormData({...formData, cohort_name: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày bắt đầu *
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày kết thúc
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số học viên tối đa
                    </label>
                    <input
                      type="number"
                      value={formData.max_students}
                      onChange={(e) => setFormData({...formData, max_students: parseInt(e.target.value) || 30})}
                      className="input-field"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số học viên hiện tại
                    </label>
                    <input
                      type="number"
                      value={formData.current_students}
                      onChange={(e) => setFormData({...formData, current_students: parseInt(e.target.value) || 0})}
                      className="input-field"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="input-field"
                    >
                      <option value="planning">Đang lên kế hoạch</option>
                      <option value="active">Đang diễn ra</option>
                      <option value="completed">Đã hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Khóa học
                    </label>
                    <select
                      value={formData.course_id}
                      onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                      className="input-field"
                    >
                      <option value="">Chọn khóa học</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.course_name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giảng viên
                    </label>
                    <select
                      value={formData.instructor_id}
                      onChange={(e) => setFormData({...formData, instructor_id: e.target.value})}
                      className="input-field"
                    >
                      <option value="">Chọn giảng viên</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
                      ))}
                    </select>
                  </div>
                </div>

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

export default CohortManagement
