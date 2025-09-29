import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Filter, BookOpen, Clock, GraduationCap, Building2, Link as LinkIcon } from 'lucide-react'
import { courseAPI, courseCategoryAPI, departmentAPI } from '@/services/api'
import toast from 'react-hot-toast'

const CourseManagement = () => {
  const [courses, setCourses] = useState([])
  const [categories, setCategories] = useState([])
  const [departments, setDepartments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    description: '',
    total_credits: '',
    theory_credits: '',
    practice_credits: '',
    managing_department_id: '',
    category_id: '',
    duration_hours: '',
    level: 'Beginner',
    prerequisite_course_ids: [],
    corequisite_course_ids: [],
    prior_course_ids: [],
    learning_objectives: ''
  })

  // ===== Modal helpers: lock scroll + close on ESC
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    const onKey = (e) => e.key === 'Escape' && setShowModal(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [showModal])

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      await Promise.all([loadCourses(), loadCategories(), loadDepartments()])
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const loadCourses = async () => {
    try {
      const response = await courseAPI.getAll()
      const processedCourses = (response.data || []).map(course => ({
        ...course,
        prerequisite_course_ids: course.prerequisite_course_ids
          ? (typeof course.prerequisite_course_ids === 'string'
            ? JSON.parse(course.prerequisite_course_ids)
            : course.prerequisite_course_ids)
          : [],
        corequisite_course_ids: course.corequisite_course_ids
          ? (typeof course.corequisite_course_ids === 'string'
            ? JSON.parse(course.corequisite_course_ids)
            : course.corequisite_course_ids)
          : [],
        prior_course_ids: course.prior_course_ids
          ? (typeof course.prior_course_ids === 'string'
            ? JSON.parse(course.prior_course_ids)
            : course.prior_course_ids)
          : []
      }))
      setCourses(processedCourses)
    } catch (error) {
      console.error('Error loading courses:', error)
      toast.error(error.message)
    }
  }

  const loadCategories = async () => {
    try {
      const res = await courseCategoryAPI.getAll()
      setCategories(res.data || [])
    } catch (e) { console.error('Error loading categories:', e) }
  }

  const loadDepartments = async () => {
    try {
      const res = await departmentAPI.getAll()
      setDepartments(res.data || [])
    } catch (e) { console.error('Error loading departments:', e) }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      (course.course_name && course.course_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.course_code && course.course_code.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === 'all' || course.category_id === parseInt(categoryFilter)
    const matchesDepartment = departmentFilter === 'all' || course.managing_department_id === parseInt(departmentFilter)
    return matchesSearch && matchesCategory && matchesDepartment
  })

  const getCourseNamesByIds = (courseIds) => {
    if (!courseIds || courseIds.length === 0) return 'Không có'
    return courseIds.map(id => {
      const course = courses.find(c => c.id === id)
      return course ? course.course_code : `ID:${id}`
    }).join(', ')
  }

  const handleCreate = () => {
    setModalType('create')
    setSelectedCourse(null)
    setFormData({
      course_code: '',
      course_name: '',
      description: '',
      total_credits: '',
      theory_credits: '',
      practice_credits: '',
      managing_department_id: '',
      category_id: '',
      duration_hours: '',
      level: 'Beginner',
      prerequisite_course_ids: [],
      corequisite_course_ids: [],
      prior_course_ids: [],
      learning_objectives: ''
    })
    setShowModal(true)
  }

  const handleEdit = (course) => {
    setModalType('edit')
    setSelectedCourse(course)
    setFormData({
      course_code: course.course_code || '',
      course_name: course.course_name || '',
      description: course.description || '',
      total_credits: course.total_credits || '',
      theory_credits: course.theory_credits || '',
      practice_credits: course.practice_credits || '',
      managing_department_id: course.managing_department_id || '',
      category_id: course.category_id || '',
      duration_hours: course.duration_hours || '',
      level: course.level || 'Beginner',
      prerequisite_course_ids: course.prerequisite_course_ids || [],
      corequisite_course_ids: course.corequisite_course_ids || [],
      prior_course_ids: course.prior_course_ids || [],
      learning_objectives: course.learning_objectives || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (course) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa học phần ${course.course_name}?`)) return
    try {
      await courseAPI.delete(course.id)
      toast.success('Xóa học phần thành công!')
      loadCourses()
    } catch (error) {
      console.error('Delete error:', error)
      toast.error(error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const totalCredits = parseInt(formData.total_credits) || 0
      const theoryCredits = parseInt(formData.theory_credits) || 0
      const practiceCredits = parseInt(formData.practice_credits) || 0
      if (theoryCredits + practiceCredits !== totalCredits) {
        toast.error('Tổng số TC LT và TC TH phải bằng tổng số tín chỉ!')
        return
      }
      if (modalType === 'create') {
        await courseAPI.create(formData)
        toast.success('Tạo học phần thành công!')
      } else {
        await courseAPI.update(selectedCourse.id, formData)
        toast.success('Cập nhật học phần thành công!')
      }
      await loadCourses()
      setShowModal(false)
    } catch (error) {
      console.error('Submit error:', error)
      toast.error(error.message)
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
  const getLevelText = (level) => {
    switch (level) {
      case 'Beginner': return 'Cơ bản'
      case 'Intermediate': return 'Trung cấp'
      case 'Advanced': return 'Nâng cao'
      default: return level
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý học phần</h1>
          <p className="text-gray-600 mt-2">Quản lý học phần và môn học trong hệ thống</p>
        </div>
        <button type="button" onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Thêm học phần</span>
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
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng tín chỉ</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.reduce((sum, c) => sum + (c.total_credits || 0), 0)}
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
              <p className="text-sm font-medium text-gray-600">Tổng giờ học</p>
              <p className="text-2xl font-bold text-gray-900">
                {courses.reduce((sum, c) => sum + (c.duration_hours || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500 rounded-full">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Khoa quản lý</p>
              <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm học phần..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.category_name || cat.name}</option>
            ))}
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả khoa</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.department_name || dept.name}</option>
            ))}
          </select>
        </div>

        <button type="button" className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          <Filter className="w-5 h-5" />
          <span>Bộ lọc nâng cao</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-x-auto sm:rounded-md">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có dữ liệu</h3>
            <p className="text-gray-500">Chưa có học phần nào hoặc không có kết quả tìm kiếm.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Mã HP</th>
                <th className="table-header">Tên học phần</th>
                <th className="table-header">Tín chỉ</th>
                <th className="table-header">TC LT/TH</th>
                <th className="table-header">Khoa quản lý</th>
                <th className="table-header">HP tiên quyết</th>
                <th className="table-header">HP song hành</th>
                <th className="table-header">Cấp độ</th>
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
                  <td className="table-cell">
                    <div className="flex items-center">
                      <GraduationCap className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="font-semibold">{course.total_credits}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm">
                      <div className="text-green-600">LT: {course.theory_credits}</div>
                      <div className="text-orange-600">TH: {course.practice_credits}</div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                      {course.managing_dept_name || 'N/A'}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="max-w-xs">
                      {course.prerequisite_course_ids && course.prerequisite_course_ids.length > 0 ? (
                        <div className="flex items-start">
                          <LinkIcon className="w-4 h-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            {getCourseNamesByIds(course.prerequisite_course_ids)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Không có</span>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="max-w-xs">
                      {course.corequisite_course_ids && course.corequisite_course_ids.length > 0 ? (
                        <div className="flex items-start">
                          <LinkIcon className="w-4 h-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">
                            {getCourseNamesByIds(course.corequisite_course_ids)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Không có</span>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                      {getLevelText(course.level)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button type="button" onClick={() => handleEdit(course)} className="text-blue-600 hover:text-blue-900" title="Chỉnh sửa">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => handleDelete(course)} className="text-red-600 hover:text-red-900" title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ===== Modal Create / Edit Course ===== */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* overlay */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
          {/* content */}
          <div className="relative bg-white w-full max-w-3xl rounded-xl shadow-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                {modalType === 'create' ? 'Thêm học phần' : 'Chỉnh sửa học phần'}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mã học phần</label>
                  <input
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.course_code}
                    onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tên học phần</label>
                  <input
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.course_name}
                    onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Tổng tín chỉ</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.total_credits}
                    onChange={(e) => setFormData({ ...formData, total_credits: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">TC LT</label>
                    <input
                      type="number"
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.theory_credits}
                      onChange={(e) => setFormData({ ...formData, theory_credits: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">TC TH</label>
                    <input
                      type="number"
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.practice_credits}
                      onChange={(e) => setFormData({ ...formData, practice_credits: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Khoa quản lý</label>
                  <select
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.managing_department_id}
                    onChange={(e) => setFormData({ ...formData, managing_department_id: e.target.value })}
                  >
                    <option value="">-- chọn khoa --</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.department_name || d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Danh mục</label>
                  <select
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  >
                    <option value="">-- chọn danh mục --</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.category_name || c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Số giờ học</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.duration_hours}
                    onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Cấp độ</label>
                  <select
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50">
                  Hủy
                </button>
                <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                  {modalType === 'create' ? 'Tạo học phần' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CourseManagement