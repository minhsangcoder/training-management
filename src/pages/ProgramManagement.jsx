import React, { useEffect, useState } from 'react'
import { programAPI } from '@/services/api'
import toast from 'react-hot-toast'

function ProgramManagement() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    program_code: '',
    program_name: '',
    description: '',
    start_date: '',
    end_date: '',
    is_active: true,
  })

  const fetchPrograms = async () => {
    try {
      setLoading(true)
      const res = await programAPI.getAll()
      setPrograms(res.data || [])
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrograms()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      if (!form.program_code || !form.program_name) {
        toast.error('Mã chương trình và tên chương trình là bắt buộc')
        return
      }
      await programAPI.create(form)
      toast.success('Tạo chương trình thành công')
      setForm({ program_code: '', program_name: '', description: '', start_date: '', end_date: '', is_active: true })
      fetchPrograms()
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Xóa chương trình này?')) return
    try {
      await programAPI.delete(id)
      toast.success('Đã xóa')
      fetchPrograms()
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Quản lý chương trình</h1>

      <form onSubmit={handleCreate} className="bg-white shadow rounded p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Mã chương trình</label>
          <input name="program_code" value={form.program_code} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tên chương trình</label>
          <input name="program_name" value={form.program_name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Mô tả</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" rows={3} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
          <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Ngày kết thúc</label>
          <input type="date" name="end_date" value={form.end_date} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex items-center gap-2">
          <input id="is_active" type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
          <label htmlFor="is_active">Đang hoạt động</label>
        </div>
        <div className="md:col-span-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Tạo chương trình</button>
        </div>
      </form>

      <div className="bg-white shadow rounded">
        <div className="p-4 border-b font-medium">Danh sách chương trình</div>
        <div className="p-4 overflow-x-auto">
          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="p-2">Mã</th>
                  <th className="p-2">Tên chương trình</th>
                  <th className="p-2">Ngày bắt đầu</th>
                  <th className="p-2">Ngày kết thúc</th>
                  <th className="p-2">Trạng thái</th>
                  <th className="p-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="p-2">{p.program_code}</td>
                    <td className="p-2">{p.program_name}</td>
                    <td className="p-2">{p.start_date || '-'}</td>
                    <td className="p-2">{p.end_date || '-'}</td>
                    <td className="p-2">{p.is_active ? 'Active' : 'Inactive'}</td>
                    <td className="p-2">
                      <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProgramManagement
