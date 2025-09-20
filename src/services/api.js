import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Thêm token nếu có
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Xử lý khi token hết hạn
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API functions
export const departmentAPI = {
  // Lấy danh sách phòng ban
  getDepartments: () => api.get('/departments'),
  
  // Lấy chi tiết phòng ban
  getDepartment: (id) => api.get(`/departments/${id}`),
  
  // Tạo phòng ban mới
  createDepartment: (data) => api.post('/departments', data),
  
  // Cập nhật phòng ban
  updateDepartment: (id, data) => api.put(`/departments/${id}`, data),
  
  // Xóa phòng ban
  deleteDepartment: (id) => api.delete(`/departments/${id}`),
  
  // Lấy danh sách chức vụ
  getPositions: () => api.get('/positions'),
  
  // Tạo chức vụ mới
  createPosition: (data) => api.post('/positions', data),
  
  // Cập nhật chức vụ
  updatePosition: (id, data) => api.put(`/positions/${id}`, data),
  
  // Xóa chức vụ
  deletePosition: (id) => api.delete(`/positions/${id}`),
}

export const employeeAPI = {
  // Lấy danh sách nhân viên
  getEmployees: (params = {}) => api.get('/employees', { params }),
  
  // Lấy chi tiết nhân viên
  getEmployee: (id) => api.get(`/employees/${id}`),
  
  // Tạo nhân viên mới
  createEmployee: (data) => api.post('/employees', data),
  
  // Cập nhật nhân viên
  updateEmployee: (id, data) => api.put(`/employees/${id}`, data),
  
  // Xóa nhân viên
  deleteEmployee: (id) => api.delete(`/employees/${id}`),
  
  // Tìm kiếm nhân viên
  searchEmployees: (query) => api.get(`/employees/search?q=${query}`),
}

export const courseAPI = {
  // Lấy danh sách danh mục học phần
  getCategories: () => api.get('/course-categories'),
  
  // Tạo danh mục mới
  createCategory: (data) => api.post('/course-categories', data),
  
  // Cập nhật danh mục
  updateCategory: (id, data) => api.put(`/course-categories/${id}`, data),
  
  // Xóa danh mục
  deleteCategory: (id) => api.delete(`/course-categories/${id}`),
  
  // Lấy danh sách học phần
  getCourses: (params = {}) => api.get('/courses', { params }),
  
  // Lấy chi tiết học phần
  getCourse: (id) => api.get(`/courses/${id}`),
  
  // Tạo học phần mới
  createCourse: (data) => api.post('/courses', data),
  
  // Cập nhật học phần
  updateCourse: (id, data) => api.put(`/courses/${id}`, data),
  
  // Xóa học phần
  deleteCourse: (id) => api.delete(`/courses/${id}`),
  
  // Lấy danh sách khóa học
  getCourseSessions: (params = {}) => api.get('/course-sessions', { params }),
  
  // Tạo khóa học mới
  createCourseSession: (data) => api.post('/course-sessions', data),
  
  // Cập nhật khóa học
  updateCourseSession: (id, data) => api.put(`/course-sessions/${id}`, data),
  
  // Xóa khóa học
  deleteCourseSession: (id) => api.delete(`/course-sessions/${id}`),
  
  // Đăng ký học phần
  enrollCourse: (data) => api.post('/enrollments', data),
  
  // Lấy danh sách đăng ký
  getEnrollments: (params = {}) => api.get('/enrollments', { params }),
  
  // Cập nhật trạng thái đăng ký
  updateEnrollment: (id, data) => api.put(`/enrollments/${id}`, data),
}

export const dashboardAPI = {
  // Lấy thống kê tổng quan
  getStats: () => api.get('/dashboard/stats'),
  
  // Lấy báo cáo đăng ký theo tháng
  getEnrollmentReport: (params = {}) => api.get('/dashboard/enrollment-report', { params }),
  
  // Lấy top học phần được đăng ký nhiều nhất
  getTopCourses: () => api.get('/dashboard/top-courses'),
  
  // Lấy khóa học sắp bắt đầu
  getUpcomingCourses: () => api.get('/dashboard/upcoming-courses'),
}

export default api
