import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { ReactElement } from 'react'
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'
import TemplatePickerPage from './pages/TemplatePickerPage'
import DashboardBuilderPage from './pages/DashboardBuilderPage'
import DashboardViewPage from './pages/DashboardViewPage'
import DashboardSharedPage from './pages/DashboardSharedPage'
import ComingSoonPage from './pages/ComingSoonPage'
import LoginPage from './pages/LoginPage'
import AppLoader from './components/AppLoader'
import NotFoundPage from './components/NotFoundPage'
import { useAuth } from './context/AuthContext'

function RequireAuth({ children }: { children: ReactElement }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/" replace />
  return children
}

function LoginRoute() {
  const { user } = useAuth()
  return user ? <Navigate to="/home" replace /> : <LoginPage />
}

function RootRoute() {
  const { user } = useAuth()
  return user ? <Navigate to="/home" replace /> : <LandingPage />
}

const router = createBrowserRouter([
  { path: '/login',        element: <LoginRoute /> },
  { path: '/',             element: <RootRoute /> },
  { path: '/home',         element: <RequireAuth><HomePage /></RequireAuth> },
  { path: '/templates',    element: <RequireAuth><TemplatePickerPage /></RequireAuth> },
  { path: '/builder/:id',       element: <RequireAuth><DashboardBuilderPage /></RequireAuth> },
  { path: '/dashboard/preview', element: <RequireAuth><DashboardViewPage /></RequireAuth> },
  { path: '/dashboard/:id',     element: <DashboardSharedPage /> },
  { path: '/docs',         element: <ComingSoonPage /> },
  { path: '/api',          element: <ComingSoonPage /> },
  { path: '/community',    element: <ComingSoonPage /> },
  { path: '/help-center',  element: <ComingSoonPage /> },
  { path: '*',             element: <NotFoundPage /> },
])

function App() {
  const { loading, isSigningOut } = useAuth()
  if (loading || isSigningOut) return <AppLoader />
  return <RouterProvider router={router} />
}

export default App
