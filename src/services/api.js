// src/services/api.js - UPDATED VERSION
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data)
    return response
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message)
    
    if (!error.response) {
      console.error('🔴 Network Error - Backend server không chạy hoặc không kết nối được')
    }
    
    return Promise.reject(error)
  }
)

// DEPARTMENTS API
export const departmentAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/departments')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể tải danh sách phòng ban')
    }
  },

  create: async (departmentData) => {
    try {
      const response = await api.post('/departments', departmentData)
      return {
        success: true,
        message: 'Thêm phòng ban thành công',
        data: response.data
      }
    } catch (error) {
      if (error.response?.data?.error?.includes('Validation error')) {
        throw new Error('Mã phòng ban đã tồn tại')
      }
      throw new Error(error.response?.data?.error || 'Không thể thêm phòng ban')
    }
  },

  update: async (id, departmentData) => {
    try {
      const response = await api.put(`/departments/${id}`, departmentData)
      return {
        success: true,
        message: 'Cập nhật phòng ban thành công',
        data: response.data
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể cập nhật phòng ban')
    }
  },

  delete: async (id) => {
    try {
      await api.delete(`/departments/${id}`)
      return {
        success: true,
        message: 'Xóa phòng ban thành công'
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể xóa phòng ban')
    }
  }
}

// POSITIONS API
export const positionAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/positions')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể tải danh sách chức vụ')
    }
  },

  create: async (positionData) => {
    try {
      const response = await api.post('/positions', positionData)
      return {
        success: true,
        message: 'Thêm chức vụ thành công',
        data: response.data
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể thêm chức vụ')
    }
  },

  update: async (id, positionData) => {
    try {
      const response = await api.put(`/positions/${id}`, positionData)
      return {
        success: true,
        message: 'Cập nhật chức vụ thành công',
        data: response.data
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể cập nhật chức vụ')
    }
  },

  delete: async (id) => {
    try {
      await api.delete(`/positions/${id}`)
      return {
        success: true,
        message: 'Xóa chức vụ thành công'
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể xóa chức vụ')
    }
  }
}

// COURSES API - UPDATED WITH NEW FIELDS
export const courseAPI = {
  // Lấy tất cả học phần
  getAll: async () => {
    try {
      const response = await api.get('/courses')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể tải danh sách học phần')
    }
  },

  // Lấy học phần theo ID
  getById: async (id) => {
    try {
      const response = await api.get(`/courses/${id}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể tải thông tin học phần')
    }
  },

  // Tạo học phần mới
  create: async (courseData) => {
    try {
      // Validate dữ liệu
      if (!courseData.course_code || !courseData.course_name) {
        throw new Error('Mã học phần và tên học phần là bắt buộc')
      }

      // Xử lý các trường JSON
      const processedData = {
        ...courseData,
        prerequisite_course_ids: courseData.prerequisite_course_ids || [],
        corequisite_course_ids: courseData.corequisite_course_ids || [],
        prior_course_ids: courseData.prior_course_ids || []
      }

      const response = await api.post('/courses', processedData)
      return {
        success: true,
        message: 'Thêm học phần thành công',
        data: response.data
      }
    } catch (error) {
      if (error.response?.data?.error?.includes('Duplicate entry')) {
        throw new Error('Mã học phần đã tồn tại')
      }
      throw new Error(error.response?.data?.error || error.message || 'Không thể thêm học phần')
    }
  },

  // Cập nhật học phần
  update: async (id, courseData) => {
    try {
      // Xử lý các trường JSON
      const processedData = {
        ...courseData,
        prerequisite_course_ids: courseData.prerequisite_course_ids || [],
        corequisite_course_ids: courseData.corequisite_course_ids || [],
        prior_course_ids: courseData.prior_course_ids || []
      }

      const response = await api.put(`/courses/${id}`, processedData)
      return {
        success: true,
        message: 'Cập nhật học phần thành công',
        data: response.data
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể cập nhật học phần')
    }
  },

  // Xóa học phần
  delete: async (id) => {
    try {
      await api.delete(`/courses/${id}`)
      return {
        success: true,
        message: 'Xóa học phần thành công'
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể xóa học phần')
    }
  },

  // Lấy tên các học phần theo danh sách ID
  getCourseNamesByIds: async (courseIds) => {
    try {
      if (!courseIds || courseIds.length === 0) {
        return { success: true, data: [] }
      }

      const response = await api.post('/courses/get-names-by-ids', { courseIds })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error getting course names:', error)
      return { success: true, data: [] }
    }
  },

  // Kiểm tra điều kiện tiên quyết
  checkPrerequisites: async (courseId, employeeId) => {
    try {
      const response = await api.post('/courses/check-prerequisites', {
        courseId,
        employeeId
      })
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể kiểm tra điều kiện tiên quyết')
    }
  }
}

// COURSE CATEGORIES API
export const courseCategoryAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/course-categories')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể tải danh mục học phần')
    }
  },

  create: async (categoryData) => {
    try {
      const response = await api.post('/course-categories', categoryData)
      return {
        success: true,
        message: 'Thêm danh mục học phần thành công',
        data: response.data
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể thêm danh mục học phần')
    }
  },

  update: async (id, categoryData) => {
    try {
      const response = await api.put(`/course-categories/${id}`, categoryData)
      return {
        success: true,
        message: 'Cập nhật danh mục học phần thành công',
        data: response.data
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể cập nhật danh mục học phần')
    }
  },

  delete: async (id) => {
    try {
      await api.delete(`/course-categories/${id}`)
      return {
        success: true,
        message: 'Xóa danh mục học phần thành công'
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể xóa danh mục học phần')
    }
  }
}

// HEALTH CHECK
export const healthAPI = {
  check: async () => {
    try {
      const response = await api.get('/health')
      return response.data
    } catch (error) {
      throw new Error('Không thể kết nối với server')
    }
  }
}

export default api