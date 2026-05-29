import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TemplatePickerPage from './pages/TemplatePickerPage'
import DashboardBuilderPage from './pages/DashboardBuilderPage'
import DashboardViewPage from './pages/DashboardViewPage'
import ComingSoonPage from './pages/ComingSoonPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"             element={<HomePage />} />
        <Route path="/templates"    element={<TemplatePickerPage />} />
        <Route path="/builder/:id"  element={<DashboardBuilderPage />} />
        <Route path="/docs"        element={<ComingSoonPage />} />
        <Route path="/api"         element={<ComingSoonPage />} />
        <Route path="/community"   element={<ComingSoonPage />} />
        <Route path="/help-center" element={<ComingSoonPage />} />
        <Route path="/dashboard/:id"  element={<DashboardViewPage />} />
        <Route path="/dashboard/preview" element={<DashboardViewPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App