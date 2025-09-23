import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Filter, User, Mail, Phone, MapPin, Calendar, DollarSign } from 'lucide-react'
import { mockEmployees, mockDepartments, mockPositions } from '@/services/mockData'
import toast from 'react-hot-toast'

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState(mockEmployees)
  const [departments] = useState(mockDepartments)
  const [positions] = useState(mockPositions)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [formData, setFormData] = useState({
    employee_code: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    date_of_birth: '',
    gender: 'Male',
    id_card: '',
    position_id: '',
    department_id: '',
    manager_id: '',
    hire_date: '',
    salary: '',
    status: 'Active'
  })

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter
    const matchesDepartment = departmentFilter === 'all' || emp.department_id === parseInt(departmentFilter)
    
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const handleCreate = () => {
    setModalType('create')
    setSelectedEmployee(null)
    setFormData({
      employee_code: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      date_of_birth: '',
      gender: 'Male',
      id_card: '',
      position_id: '',
      department_id: '',
      manager_id: '',
      hire_date: '',
      salary: '',
      status: 'Active'
    })
    setShowModal(true)
  }

  const handleEdit = (employee) => {
    setModalType('edit')
    setSelectedEmployee(employee)
    setFormData({
      employee_code: employee.employee_code,
      first_name: employee.first_name,
      last_name: employee.last_name,
      email: employee.email,
      phone: employee.phone,
      address: employee.address,
      date_of_birth: employee.date_of_birth,
      gender: employee.gender,
      id_card: employee.id_card,
      position_id: employee.position_id,
      department_id: employee.department_id,
      manager_id: employee.manager_id || '',
      hire_date: employee.hire_date,
      salary: employee.salary,
      status: employee.status
    })
    setShowModal(true)
  }

  const handleDelete = (employee) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên ${employee.full_name}?`)) {
      setEmployees(employees.filter(e => e.id !== employee.id))
      toast.success('Xóa nhân viên thành công!')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (modalType === 'create') {
      const newEmployee = {
        id: Date.now(),
        ...formData,
        full_name: `${formData.first_name} ${formData.last_name}`,
        position_name: positions.find(p => p.id === parseInt(formData.position_id))?.position_name,
        department_name: departments.find(d => d.id === parseInt(formData.department_id))?.department_name,
        manager_name: formData.manager_id ? employees.find(e => e.id === parseInt(formData.manager_id))?.full_name : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setEmployees([...employees, newEmployee])
      toast.success('Tạo nhân viên thành công!')
    } else {
      setEmployees(employees.map(emp => 
        emp.id === selectedEmployee.id 
          ? { 
              ...emp, 
              ...formData, 
              full_name: `${formData.first_name} ${formData.last_name}`,
              position_name: positions.find(p => p.id === parseInt(formData.position_id))?.position_name,
              department_name: departments.find(d => d.id === parseInt(formData.department_id))?.department_name,
              manager_name: formData.manager_id ? employees.find(e => e.id === parseInt(formData.manager_id))?.full_name : null,
              updated_at: new Date().toISOString() 
            }
          : emp
      ))
      toast.success('Cập nhật nhân viên thành công!')
    }
    
    setShowModal(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-yellow-100 text-yellow-800'
      case 'Terminated': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'Active': return 'Hoạt động'
      case 'Inactive': return 'Không hoạt động'
      case 'Terminated': return 'Đã nghỉ việc'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý nhân viên</h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin nhân viên trong tổ chức</p>
        </div>
        <button
          onClick={handleCreate}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm nhân viên</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-full">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tổng nhân viên</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-full">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">
                {employees.filter(e => e.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500 rounded-full">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Không hoạt động</p>
              <p className="text-2xl font-bold text-gray-900">
                {employees.filter(e => e.status === 'Inactive').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-red-500 rounded-full">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Đã nghỉ việc</p>
              <p className="text-2xl font-bold text-gray-900">
                {employees.filter(e => e.status === 'Terminated').length}
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
              placeholder="Tìm kiếm nhân viên..."
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
            <option value="Active">Hoạt động</option>
            <option value="Inactive">Không hoạt động</option>
            <option value="Terminated">Đã nghỉ việc</option>
          </select>
          
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả phòng ban</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.department_name}</option>
            ))}
          </select>
        </div>
        
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          <Filter className="w-5 h-5" />
          <span>Bộ lọc nâng cao</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="table-header">Mã NV</th>
              <th className="table-header">Họ tên</th>
              <th className="table-header">Email</th>
              <th className="table-header">Số điện thoại</th>
              <th className="table-header">Phòng ban</th>
              <th className="table-header">Chức vụ</th>
              <th className="table-header">Lương</th>
              <th className="table-header">Trạng thái</th>
              <th className="table-header">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="table-cell font-medium text-blue-600">{employee.employee_code}</td>
                <td className="table-cell">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{employee.full_name}</div>
                      <div className="text-sm text-gray-500">{employee.id_card}</div>
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    {employee.email}
                  </div>
                </td>
                <td className="table-cell">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2" />
                    {employee.phone}
                  </div>
                </td>
                <td className="table-cell">{employee.department_name}</td>
                <td className="table-cell">{employee.position_name}</td>
                <td className="table-cell">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                    {employee.salary?.toLocaleString('vi-VN')} VNĐ
                  </div>
                </td>
                <td className="table-cell">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                    {getStatusText(employee.status)}
                  </span>
                </td>
                <td className="table-cell">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(employee)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(employee)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {modalType === 'create' ? 'Thêm nhân viên mới' : 'Chỉnh sửa thông tin nhân viên'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mã nhân viên *
                    </label>
                    <input
                      type="text"
                      value={formData.employee_code}
                      onChange={(e) => setFormData({...formData, employee_code: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CMND/CCCD *
                    </label>
                    <input
                      type="text"
                      value={formData.id_card}
                      onChange={(e) => setFormData({...formData, id_card: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ *
                    </label>
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên *
                    </label>
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="input-field"
                    rows="2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      className="input-field"
                    >
                      <option value="Male">Nam</option>
                      <option value="Female">Nữ</option>
                      <option value="Other">Khác</option>
                    </select>
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
                      <option value="Active">Hoạt động</option>
                      <option value="Inactive">Không hoạt động</option>
                      <option value="Terminated">Đã nghỉ việc</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phòng ban *
                    </label>
                    <select
                      value={formData.department_id}
                      onChange={(e) => setFormData({...formData, department_id: e.target.value})}
                      className="input-field"
                      required
                    >
                      <option value="">Chọn phòng ban</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chức vụ *
                    </label>
                    <select
                      value={formData.position_id}
                      onChange={(e) => setFormData({...formData, position_id: e.target.value})}
                      className="input-field"
                      required
                    >
                      <option value="">Chọn chức vụ</option>
                      {positions.map(pos => (
                        <option key={pos.id} value={pos.id}>{pos.position_name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quản lý trực tiếp
                    </label>
                    <select
                      value={formData.manager_id}
                      onChange={(e) => setFormData({...formData, manager_id: e.target.value})}
                      className="input-field"
                    >
                      <option value="">Chọn quản lý</option>
                      {employees.filter(emp => emp.id !== selectedEmployee?.id).map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày vào làm *
                    </label>
                    <input
                      type="date"
                      value={formData.hire_date}
                      onChange={(e) => setFormData({...formData, hire_date: e.target.value})}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lương (VNĐ)
                  </label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    className="input-field"
                    placeholder="Nhập mức lương"
                  />
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

export default EmployeeManagement
