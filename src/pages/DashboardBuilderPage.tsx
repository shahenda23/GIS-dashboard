import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useBuilderStore } from '../features/builder/store/builderStore'
import BuilderTopBar from '../features/builder/components/BuildertopBar'
import LayersPanel from '../features/builder/components/LayersPanel'
import WidgetToolbar from '../features/builder/components/WidgetToolBar'
import WidgetCanvas from '../features/builder/components/WidgetCanvas'
import SettingsPanel from '../features/builder/components/settings/SettingsPanel'
import AppLoader from '../components/AppLoader'
import { supabase } from '../lib/supabase'

// IDs that come from the template picker — not real Supabase dashboard IDs
const TEMPLATE_IDS = new Set(['blank', 'urban', 'field', 'environmental', 'infrastructure'])

function DashboardBuilderPage() {
  const { id } = useParams()
  const loadDashboard  = useBuilderStore(s => s.loadDashboard)
  const storeIsLoading = useBuilderStore(s => s.isLoading)

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
        })
        setIsInitializing(false)
      }
      initNewDashboard()
    }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'var(--page-bg)',
      direction: 'ltr',
    }}>
      <BuilderTopBar />
      {!isLoading && <WidgetToolbar />}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {!isLoading && <LayersPanel />}
        {isLoading ? <AppLoader /> : <WidgetCanvas />}
        {!isLoading && <SettingsPanel />}
      </div>
    </div>
  )
}

export default DashboardBuilderPage
