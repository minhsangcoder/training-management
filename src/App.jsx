import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from '@/components/Layout/Layout'
import Dashboard from '@/pages/Dashboard'
import DepartmentManagement from '@/pages/DepartmentManagement'
import EmployeeManagement from '@/pages/EmployeeManagement'
import SubjectsManagement from '@/pages/SubjectManagement'
import CohortManagement from '@/pages/CohortManagement'
import MajorManagement from '@/pages/MajorManagement'
import KnowledgeBlockManagement from '@/pages/KnowledgeBlockManagement'
import CurriculumStructureManagement from '@/pages/CurriculumStructureManagement'
import ProgramManagement from '@/pages/ProgramManagement'
import CurriculumViewer from '@/pages/CurriculumViewer'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Bọc Layout và dùng nested routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="majors" element={<MajorManagement />} />
            <Route path="cohort" element={<CohortManagement />} />
            <Route path="subjects" element={<SubjectsManagement />} />
            <Route path="knowledge-blocks" element={<KnowledgeBlockManagement />} />
            <Route path="curriculum-structure" element={<CurriculumStructureManagement />} />
            <Route path="programs" element={<ProgramManagement />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="employees" element={<EmployeeManagement />} />
            <Route path="curriculum-viewer" element={<CurriculumViewer />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  )
}

export default App
