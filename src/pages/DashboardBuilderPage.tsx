import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useBuilderStore } from '../features/builder/store/builderStore'
import BuilderTopBar from '../features/builder/components/BuildertopBar'
import LayersPanel from '../features/builder/components/LayersPanel'
import WidgetToolbar from '../features/builder/components/WidgetToolBar'
import WidgetCanvas from '../features/builder/components/WidgetCanvas'
import SettingsPanel from '../features/builder/components/settings/SettingsPanel'

function DashboardBuilderPage() {
  const { id } = useParams()
  const { loadDashboard, setDashboardId } = useBuilderStore()

  useEffect(() => {
    if (id && id !== 'blank') {
      // Only reload if switching to a different dashboard
      if (useBuilderStore.getState().dashboardId !== id) {
        loadDashboard(id)
      }
    } else {
      useBuilderStore.setState({
        widgets: [],
        layers: [],
        selectedWidgetId: null,
        dashboardTitle: 'Untitled Dashboard',
        dashboardId: `dashboard-${Date.now()}`,
        isSaved: true,
        zoomToLayerId: null,
      })
    }
  }, [id])

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'var(--page-bg)',
    }}>
      <BuilderTopBar />
      <WidgetToolbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <LayersPanel />
        <WidgetCanvas />
        <SettingsPanel />
      </div>
    </div>
  )
}

export default DashboardBuilderPage