import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Responsive, WidthProvider } from 'react-grid-layout/legacy'
import { useBuilderStore } from '../features/builder/store/builderStore'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { ViewTopBar } from '../features/viewer/components/ViewTopBar'
import { EmptyState } from '../components/EmptyState'
import { renderWidget, calcLayout } from '../features/viewer/utils/widgetHelpers'
import AppLoader from '../components/AppLoader'
import AccessDeniedPage from '../components/AccessDeniedPage'
import ShareModal from '../features/dashboard/components/ShareModal'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)
const HEADER_H = 70

const labels = {
  en: {
    edit: 'Edit Dashboard', share: 'Share', previewMode: 'Preview',
    notFoundTitle: 'Dashboard Not Found',
    notFoundBody: 'This dashboard does not exist or may have been deleted.',
    backHome: 'Back to Dashboards',
    openEditor: 'Open Editor',
    noWidgetsTitle: 'No widgets yet',
    noWidgetsBody: 'Go to the editor to add charts, maps, and more.',
  },
  ar: {
    edit: 'تعديل اللوحة', share: 'مشاركة', previewMode: 'معاينة',
    notFoundTitle: 'اللوحة غير موجودة',
    notFoundBody: 'هذه اللوحة غير موجودة أو ربما تم حذفها.',
    backHome: 'العودة للوحات',
    openEditor: 'فتح المحرر',
    noWidgetsTitle: 'لا توجد ودجت بعد',
    noWidgetsBody: 'اذهب إلى المحرر لإضافة مخططات وخرائط وأكثر.',
  },
}

export default function DashboardSharedPage() {
  const { id }                    = useParams()
  const navigate                  = useNavigate()
  const { user }                  = useAuth()
  const { lang, toggleLang }      = useTheme()
  const widgets                   = useBuilderStore(s => s.widgets)
  const dashboardTitle            = useBuilderStore(s => s.dashboardTitle)
  const dashboardId               = useBuilderStore(s => s.dashboardId)
  const ownerId                   = useBuilderStore(s => s.ownerId)
  const loadDashboard             = useBuilderStore(s => s.loadDashboard)
  const isOwner                   = !!user && user.id === ownerId
  const [showShare, setShowShare] = useState(false)
  const [status, setStatus]       = useState<'loading' | 'found' | 'notfound' | 'denied'>('loading')
  const [viewportH, setViewportH] = useState(window.innerHeight)
  const t                         = labels[lang]

  useEffect(() => {
    const sync = () => setViewportH(window.innerHeight)
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

  useEffect(() => {
    if (!id) { setStatus('notfound'); return }
    setStatus('loading')
    loadDashboard(id).then(() => {
      const state = useBuilderStore.getState()
      if (state.dashboardId !== id)                         setStatus('notfound')
      else if (!state.isPublic && user?.id !== state.ownerId) setStatus('denied')
      else                                                   setStatus('found')
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.id])

  const { availH, viewRowH, gridLayout, CARD_GAP, EDGE_PAD, GRID_COLS } =
    calcLayout(widgets, viewportH, HEADER_H)

  const page = (children: React.ReactNode) => (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--page-bg)' }}>
      <ViewTopBar
        title={dashboardTitle} isPreview={false} dashboardId={dashboardId}
        isOwner={isOwner} labels={t} lang={lang} toggleLang={toggleLang}
        navigate={navigate} onShare={() => setShowShare(true)}
      />
      {children}
    </div>
  )

  if (status === 'loading') return <AppLoader />
  if (status === 'denied')  return <AccessDeniedPage />
  if (status === 'notfound') return page(
    <EmptyState icon="🔍" title={t.notFoundTitle} body={t.notFoundBody}
      cta={t.backHome} onCta={() => navigate('/home')} />
  )

  return page(
    <>
      <div style={{ flex: 1, overflow: 'auto', height: availH, direction: 'ltr' }}>
        {widgets.length === 0 ? (
          <EmptyState icon="📊" title={t.noWidgetsTitle} body={t.noWidgetsBody}
            cta={isOwner ? t.openEditor : undefined}
            onCta={isOwner ? () => navigate(`/builder/${dashboardId}`) : undefined} />
        ) : (
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: gridLayout, md: gridLayout, sm: gridLayout }}
            breakpoints={{ lg: 1200, md: 996, sm: 0 }}
            cols={{ lg: GRID_COLS, md: GRID_COLS, sm: GRID_COLS }}
            rowHeight={viewRowH} margin={[CARD_GAP, CARD_GAP]}
            containerPadding={[EDGE_PAD, EDGE_PAD]}
            isDraggable={false} isResizable={false} useCSSTransforms
          >
            {widgets.map(widget => (
              <div key={widget.id} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '12px', display: 'flex', flexDirection: 'column',
                overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0 }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>{widget.title}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '10px', color: 'var(--text-muted)', background: 'var(--page-bg)', borderRadius: '20px', padding: '2px 8px', textTransform: 'capitalize' }}>
                    {widget.type.replace('-', ' ')}
                  </span>
                </div>
                <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
                  {renderWidget(widget)}
                </div>
              </div>
            ))}
          </ResponsiveGridLayout>
        )}
      </div>
      {showShare && <ShareModal dashboardId={dashboardId} onClose={() => setShowShare(false)} />}
    </>
  )
}
