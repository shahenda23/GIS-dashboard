import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ReactElement } from 'react'
import HomePage from './pages/HomePage'
import TemplatePickerPage from './pages/TemplatePickerPage'
import DashboardBuilderPage from './pages/DashboardBuilderPage'
import DashboardViewPage from './pages/DashboardViewPage'
import ComingSoonPage from './pages/ComingSoonPage'
import LoginPage from './pages/LoginPage'
import AppLoader from './components/AppLoader'
import NotFoundPage from './components/NotFoundPage'
import { useAuth } from './context/AuthContext'

// Redirects to /login and remembers the original URL
function RequireAuth({ children }: { children: ReactElement }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  return children
}

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
          <RequireAuth><HomePage /></RequireAuth>
        } />
        <Route path="/templates" element={
          <RequireAuth><TemplatePickerPage /></RequireAuth>
        } />
        <Route path="/builder/:id" element={
          <RequireAuth><DashboardBuilderPage /></RequireAuth>
        } />
        <Route path="/dashboard/:id" element={<DashboardViewPage />} />
        <Route path="/docs"        element={<ComingSoonPage />} />
        <Route path="/api"         element={<ComingSoonPage />} />
        <Route path="/community"   element={<ComingSoonPage />} />
        <Route path="/help-center" element={<ComingSoonPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
