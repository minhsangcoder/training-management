import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from '@/components/Layout/Layout'
import Dashboard from '@/pages/Dashboard'
import DepartmentManagement from '@/pages/DepartmentManagement'
import EmployeeManagement from '@/pages/EmployeeManagement'
import CourseManagement from '@/pages/CourseManagement'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Bọc Layout và dùng nested routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="courses" element={<CourseManagement />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App
