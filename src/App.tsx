import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TemplatePickerPage from './pages/TemplatePickerPage'
import DashboardBuilderPage from './pages/DashboardBuilderPage'
import DashboardViewPage from './pages/DashboardViewPage'
import ComingSoonPage from './pages/ComingSoonPage'
import LoginPage from './pages/LoginPage'
import AppLoader from './components/AppLoader'
import { useAuth } from './context/AuthContext'

function App() {
  const { user, loading } = useAuth()

  if (loading) return <AppLoader />

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> : <LoginPage />
        } />
        <Route path="/" element={
          user ? <HomePage /> : <Navigate to="/login" replace />
        } />
        <Route path="/templates" element={
          user ? <TemplatePickerPage /> : <Navigate to="/login" replace />
        } />
        <Route path="/builder/:id" element={
          user ? <DashboardBuilderPage /> : <Navigate to="/login" replace />
        } />
        <Route path="/dashboard/:id" element={<DashboardViewPage />} />
        <Route path="/docs"      element={<ComingSoonPage />} />
        <Route path="/api"       element={<ComingSoonPage />} />
        <Route path="/community" element={<ComingSoonPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App