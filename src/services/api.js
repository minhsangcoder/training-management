// src/services/api.js - FIXED VERSION
import axios from 'axios'

// Sử dụng proxy thay vì direct URL
const api = axios.create({
  baseURL: '/api', // Dùng proxy từ vite.config.js
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
    
    // Handle network errors
    if (!error.response) {
      console.error('🔴 Network Error - Backend server không chạy hoặc không kết nối được')
    }
    
    return Promise.reject(error)
  }
)

// DEPARTMENTS API - Fixed to match backend response
export const departmentAPI = {
  // Lấy danh sách phòng ban
  getAll: async () => {
    try {
      const response = await api.get('/departments')
      // Backend trả về array trực tiếp, không có wrapper
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error in departmentAPI.getAll:', error)
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Không thể tải danh sách phòng ban'
      )
    }
  },

  // Thêm phòng ban mới
  create: async (departmentData) => {
    try {
      const response = await api.post('/departments', departmentData)
      return {
        success: true,
        message: 'Thêm phòng ban thành công',
        data: response.data
      }
    } catch (error) {
      console.error('Error in departmentAPI.create:', error)
      
      // Xử lý lỗi Sequelize unique constraint
      if (error.response?.data?.error?.includes('Validation error')) {
        throw new Error('Mã phòng ban đã tồn tại')
      }
      
      throw new Error(
        error.response?.data?.error || 
        'Không thể thêm phòng ban'
      )
    }
  },

  // Cập nhật phòng ban
  update: async (id, departmentData) => {
    try {
      const response = await api.put(`/departments/${id}`, departmentData)
      return {
        success: true,
        message: 'Cập nhật phòng ban thành công',
        data: response.data
      }
    } catch (error) {
      console.error('Error in departmentAPI.update:', error)
      throw new Error(
        error.response?.data?.error || 
        'Không thể cập nhật phòng ban'
      )
    }
  },

  // Xóa phòng ban
  delete: async (id) => {
    try {
      const response = await api.delete(`/departments/${id}`)
      return {
        success: true,
        message: 'Xóa phòng ban thành công'
      }
    } catch (error) {
      console.error('Error in departmentAPI.delete:', error)
      throw new Error(
        error.response?.data?.error || 
        'Không thể xóa phòng ban'
      )
    }
  },

  // Lấy phòng ban theo ID
  getById: async (id) => {
    try {
      const response = await api.get(`/departments/${id}`)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('Error in departmentAPI.getById:', error)
      throw new Error(
        error.response?.data?.error || 
        'Không thể tải thông tin phòng ban'
      )
    }
  }
}

// POSITIONS API - Fixed
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

// EMPLOYEES API - Fixed
export const employeeAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/employees')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể tải danh sách nhân viên')
    }
  },

  create: async (employeeData) => {
    try {
      const response = await api.post('/employees', employeeData)
      return {
        success: true,
        message: 'Thêm nhân viên thành công',
        data: response.data
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể thêm nhân viên')
    }
  },

  update: async (id, employeeData) => {
    try {
      const response = await api.put(`/employees/${id}`, employeeData)
      return {
        success: true,
        message: 'Cập nhật nhân viên thành công',
        data: response.data
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể cập nhật nhân viên')
    }
  },

  delete: async (id) => {
    try {
      await api.delete(`/employees/${id}`)
      return {
        success: true,
        message: 'Xóa nhân viên thành công'
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể xóa nhân viên')
    }
  }
}

// COURSES API - Fixed
export const courseAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/courses')
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể tải danh sách khóa học')
    }
  },

  create: async (courseData) => {
    try {
      const response = await api.post('/courses', courseData)
      return {
        success: true,
        message: 'Thêm khóa học thành công',
        data: response.data
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể thêm khóa học')
    }
  },

  update: async (id, courseData) => {
    try {
      const response = await api.put(`/courses/${id}`, courseData)
      return {
        success: true,
        message: 'Cập nhật khóa học thành công',
        data: response.data
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể cập nhật khóa học')
    }
  },

  delete: async (id) => {
    try {
      await api.delete(`/courses/${id}`)
      return {
        success: true,
        message: 'Xóa khóa học thành công'
      }
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Không thể xóa khóa học')
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