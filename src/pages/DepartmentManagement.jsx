import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Filter, Building, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const DepartmentManagement = () => {
  const [activeTab, setActiveTab] = useState('departments')
  const [departments, setDepartments] = useState([])
  const [positions, setPositions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [selectedItem, setSelectedItem] = useState(null)
  const [formData, setFormData] = useState({
    department_code: '',
    department_name: '',
    description: '',
    parent_department_id: null,
    manager_id: null
  })

  // Fetch dữ liệu từ backend
  useEffect(() => {
    fetchDepartments()
    fetchPositions()
  }, [])

  const fetchDepartments = () => {
    axios.get(`${API_URL}/departments`)
      .then(res => setDepartments(res.data))
      .catch(() => toast.error('Không tải được danh sách phòng ban'))
  }

  const fetchPositions = () => {
    axios.get(`${API_URL}/positions`)
      .then(res => setPositions(res.data))
      .catch(() => toast.error('Không tải được danh sách chức vụ'))
  }

  // Bộ lọc tìm kiếm
  const filteredDepartments = departments.filter(dept =>
    dept.department_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.department_code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredPositions = positions.filter(pos =>
    pos.position_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pos.position_code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // CRUD
  const handleCreate = () => {
    setModalType('create')
    setSelectedItem(null)
    setFormData({
      department_code: '',
      department_name: '',
      description: '',
      parent_department_id: null,
      manager_id: null
    })
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setModalType('edit')
    setSelectedItem(item)
    setFormData(item)
    setShowModal(true)
  }

  const handleDelete = (item) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${item.department_name || item.position_name}?`)) return

    if (activeTab === 'departments') {
      axios.delete(`${API_URL}/departments/${item.id}`)
        .then(() => {
          toast.success('Xóa phòng ban thành công!')
          fetchDepartments()
        })
        .catch(() => toast.error('Lỗi khi xóa phòng ban'))
    } else {
      axios.delete(`${API_URL}/positions/${item.id}`)
        .then(() => {
          toast.success('Xóa chức vụ thành công!')
          fetchPositions()
        })
        .catch(() => toast.error('Lỗi khi xóa chức vụ'))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (activeTab === 'departments') {
      if (modalType === 'create') {
        axios.post(`${API_URL}/departments`, formData)
          .then(() => {
            toast.success('Tạo phòng ban thành công!')
            fetchDepartments()
            setShowModal(false)
          })
          .catch(() => toast.error('Lỗi khi tạo phòng ban'))
      } else {
        axios.put(`${API_URL}/departments/${selectedItem.id}`, formData)
          .then(() => {
            toast.success('Cập nhật phòng ban thành công!')
            fetchDepartments()
            setShowModal(false)
          })
          .catch(() => toast.error('Lỗi khi cập nhật phòng ban'))
      }
    } else {
      if (modalType === 'create') {
        axios.post(`${API_URL}/positions`, formData)
          .then(() => {
            toast.success('Tạo chức vụ thành công!')
            fetchPositions()
            setShowModal(false)
          })
          .catch(() => toast.error('Lỗi khi tạo chức vụ'))
      } else {
        axios.put(`${API_URL}/positions/${selectedItem.id}`, formData)
          .then(() => {
            toast.success('Cập nhật chức vụ thành công!')
            fetchPositions()
            setShowModal(false)
          })
          .catch(() => toast.error('Lỗi khi cập nhật chức vụ'))
      }
    }
  }

  // Bảng hiển thị phòng ban
  const DepartmentTable = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="table-header">Mã phòng ban</th>
            <th className="table-header">Tên phòng ban</th>
            <th className="table-header">Mô tả</th>
            <th className="table-header">Trưởng phòng</th>
            <th className="table-header">Trạng thái</th>
            <th className="table-header">Thao tác</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredDepartments.map((dept) => (
            <tr key={dept.id} className="hover:bg-gray-50">
              <td className="table-cell font-medium text-blue-600">{dept.department_code}</td>
              <td className="table-cell">{dept.department_name}</td>
              <td className="table-cell max-w-xs truncate">{dept.description}</td>
              <td className="table-cell">{dept.manager_name || 'Chưa có'}</td>
              <td className="table-cell">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  dept.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {dept.is_active ? 'Hoạt động' : 'Không hoạt động'}
                </span>
              </td>
              <td className="table-cell">
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(dept)} className="text-blue-600 hover:text-blue-900">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(dept)} className="text-red-600 hover:text-red-900">
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

  // Bảng hiển thị chức vụ
  const PositionTable = () => (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="table-header">Mã chức vụ</th>
            <th className="table-header">Tên chức vụ</th>
            <th className="table-header">Cấp bậc</th>
            <th className="table-header">Phòng ban</th>
            <th className="table-header">Mô tả</th>
            <th className="table-header">Thao tác</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredPositions.map((pos) => (
            <tr key={pos.id} className="hover:bg-gray-50">
              <td className="table-cell font-medium text-blue-600">{pos.position_code}</td>
              <td className="table-cell">{pos.position_name}</td>
              <td className="table-cell">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Cấp {pos.level}
                </span>
              </td>
              <td className="table-cell">{pos.department_name}</td>
              <td className="table-cell max-w-xs truncate">{pos.description}</td>
              <td className="table-cell">
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(pos)} className="text-blue-600 hover:text-blue-900">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(pos)} className="text-red-600 hover:text-red-900">
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
          <h1 className="text-3xl font-bold text-gray-900">Quản lý cơ cấu tổ chức</h1>
          <p className="text-gray-600 mt-2">Quản lý phòng ban và chức vụ trong tổ chức</p>
        </div>
        <button onClick={handleCreate} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Thêm mới</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('departments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'departments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Building className="w-5 h-5 inline mr-2" />
            Phòng ban ({departments.length})
          </button>
          <button
            onClick={() => setActiveTab('positions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'positions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="w-5 h-5 inline mr-2" />
            Chức vụ ({positions.length})
          </button>
        </nav>
      </div>

      {/* Search and Filter */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            <span>Bộ lọc</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {activeTab === 'departments' ? <DepartmentTable /> : <PositionTable />}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {modalType === 'create' 
                  ? `Thêm ${activeTab === 'departments' ? 'phòng ban' : 'chức vụ'} mới`
                  : `Chỉnh sửa ${activeTab === 'departments' ? 'phòng ban' : 'chức vụ'}`}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã {activeTab === 'departments' ? 'phòng ban' : 'chức vụ'}
                  </label>
                  <input
                    type="text"
                    value={formData.department_code || formData.position_code || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      [activeTab === 'departments' ? 'department_code' : 'position_code']: e.target.value
                    })}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên {activeTab === 'departments' ? 'phòng ban' : 'chức vụ'}
                  </label>
                  <input
                    type="text"
                    value={formData.department_name || formData.position_name || ''}
                    onChange={(e) => setFormData({
                      ...formData, 
                      [activeTab === 'departments' ? 'department_name' : 'position_name']: e.target.value
                    })}
                    className="input-field"
                    required
                  />
                </div>

                {activeTab === 'positions' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cấp bậc
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.level || ''}
                        onChange={(e) => setFormData({...formData, level: parseInt(e.target.value)})}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phòng ban
                      </label>
                      <select
                        value={formData.department_id || ''}
                        onChange={(e) => setFormData({...formData, department_id: parseInt(e.target.value)})}
                        className="input-field"
                        required
                      >
                        <option value="">Chọn phòng ban</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="input-field"
                    rows="3"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                    Hủy
                  </button>
                  <button type="submit" className="btn-primary">
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

export default DepartmentManagement
