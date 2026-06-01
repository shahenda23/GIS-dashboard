import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useBuilderStore } from '../features/builder/store/builderStore'
import { useAuth } from '../context/AuthContext'
import AccessDeniedPage from '../components/AccessDeniedPage'
import BuilderTopBar from '../features/builder/components/BuildertopBar'
import LayersPanel from '../features/builder/components/LayersPanel'
import WidgetDock from '../features/builder/components/WidgetDock'
import WidgetCanvas from '../features/builder/components/WidgetCanvas'
import SettingsPanel from '../features/builder/components/settings/SettingsPanel'
import AppLoader from '../components/AppLoader'
import { supabase } from '../lib/supabase'

// IDs that come from the template picker — not real Supabase dashboard IDs
const TEMPLATE_IDS = new Set(['blank', 'urban', 'field', 'environmental', 'infrastructure'])

function DashboardBuilderPage() {
  const { id } = useParams()
  const { user }        = useAuth()
  const loadDashboard   = useBuilderStore(s => s.loadDashboard)
  const storeIsLoading  = useBuilderStore(s => s.isLoading)
  const ownerId         = useBuilderStore(s => s.ownerId)

  // Starts true so the very first render never shows stale store content
  const [isInitializing, setIsInitializing] = useState(true)

  const isTemplateRoute = !id || TEMPLATE_IDS.has(id)
  const isLoading = isInitializing || storeIsLoading

  useEffect(() => {
    setIsInitializing(true)

    if (!isTemplateRoute && id) {
      // Real dashboard UUID — load from Supabase
      if (useBuilderStore.getState().dashboardId !== id) {
        useBuilderStore.setState({
          widgets:          [],
          layers:           [],
          selectedWidgetId: null,
          dashboardTitle:   '',
          dashboardId:      id,
          isSaved:          true,
          zoomToLayerId:    null,
          ownerId:          null,   // reset so stale value never bypasses the access check
        })
        loadDashboard(id)  // sets store.isLoading true → false when done
      }
      // store.isLoading covers the rest; local init done
      setIsInitializing(false)
    } else {
      // Template or blank — create a fresh dashboard
      async function initNewDashboard() {
        const { count } = await supabase
          .from('dashboards')
          .select('*', { count: 'exact', head: true })

        const num   = (count ?? 0) + 1
        const title = `Untitled Dashboard ${num}`

        useBuilderStore.setState({
          widgets:          [],
          layers:           [],
          selectedWidgetId: null,
          dashboardTitle:   title,
          dashboardId:      crypto.randomUUID(),
          isSaved:          true,
          zoomToLayerId:    null,
          ownerId:          user?.id ?? null,  // set owner so preview → back to builder works
        })
        setIsInitializing(false)
      }
      initNewDashboard()
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Non-owner or failed load (RLS blocked) → deny access
  // ownerId null after load = RLS blocked the read (private dashboard of another user)
  // ownerId set but !== user.id = public dashboard of another user
  if (!isLoading && !isTemplateRoute && (!ownerId || (user && ownerId !== user.id))) {
    return <AccessDeniedPage />
  }

  return (
    <div style={{
      height:              '100vh',
      display:             'flex',
      flexDirection:       'column',
      overflow:            'hidden',
      background:          '#f1f5f9',
      backgroundImage:     'radial-gradient(circle, #c8d3e0 1px, transparent 1px)',
      backgroundSize:      '24px 24px',
      direction:           'ltr',
    }}>
      <BuilderTopBar />

      {/* Main content row */}
      <div style={{
        display:  'flex',
        flex:     1,
        overflow: 'hidden',
        padding:  '8px 12px 0 12px',
        gap:      '10px',
      }}>
        {!isLoading && <LayersPanel />}
        {isLoading ? <AppLoader /> : <WidgetCanvas />}
        {!isLoading && <SettingsPanel />}
      </div>

      {/* macOS-style dock at bottom */}
      {!isLoading && (
        <div style={{
          display:        'flex',
          justifyContent: 'center',
          padding:        '10px 0 14px',
          flexShrink:     0,
        }}>
          <WidgetDock />
        </div>
      )}
    </div>
  )
}

export default DashboardBuilderPage
