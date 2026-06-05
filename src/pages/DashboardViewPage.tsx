import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import logoUrl from '../assets/logo.svg'
import AppLoader from '../components/AppLoader'
import AccessDeniedPage from '../components/AccessDeniedPage'
import { useAuth } from '../context/AuthContext'
import { Responsive, WidthProvider } from 'react-grid-layout/legacy'
import type { LayoutItem } from 'react-grid-layout/legacy'
import { useBuilderStore } from '../features/builder/store/builderStore'
import { Widget } from '../features/builder/types/builder.types'
import MapWidget from '../features/builder/components/widgets/MapWidget2'
import ChartWidget from '../features/builder/components/widgets/ChartWidget'
import TableWidget from '../features/builder/components/widgets/TableWidget'
import KPIWidget from '../features/builder/components/widgets/KPIWidget'
import FilterWidget from '../features/builder/components/widgets/FilterWidget'
import ShareModal from '../features/dashboard/components/ShareModal'
import { useTheme } from '../context/ThemeContext'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

const HEADER_H  = 54
const BANNER_H  = 44
const CARD_GAP  = 16
const EDGE_PAD  = 40
const GRID_COLS = 12

const GLASS: React.CSSProperties = {
  background:           'rgba(255,255,255,0.78)',
  backdropFilter:       'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border:               '1px solid rgba(255,255,255,0.85)',
  borderRadius:         '40px',
  boxShadow:            '0 4px 20px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.95)',
}

function renderWidget(widget: Widget) {
  const cfg = widget.config ?? {}
  if (widget.type === 'map')    return <MapWidget widgetId={widget.id} config={cfg as any} />
  if (widget.type === 'table')  return <TableWidget config={cfg as any} />
  if (widget.type === 'kpi')    return <KPIWidget config={cfg as any} />
  if (widget.type === 'filter') return <FilterWidget />
  return <ChartWidget type={widget.type} config={cfg as any} />
}

function scaleLayout(widgets: Widget[], colScale: number): LayoutItem[] {
  return widgets.map(w => {
    const scaledX     = Math.round(w.x * colScale)
    const scaledRight = Math.round((w.x + w.w) * colScale)
    return { i: w.id, x: scaledX, w: Math.max(1, scaledRight - scaledX), y: w.y, h: w.h, static: true }
  })
}

export default function DashboardViewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { lang, toggleLang } = useTheme()
  const widgets        = useBuilderStore(s => s.widgets)
  const dashboardTitle = useBuilderStore(s => s.dashboardTitle)
  const dashboardId    = useBuilderStore(s => s.dashboardId)

  const ownerId        = useBuilderStore(s => s.ownerId)
  const loadDashboard  = useBuilderStore(s => s.loadDashboard)
  const isOwner        = !!user && user.id === ownerId
  const [showShare, setShowShare] = useState(false)
  const [status,    setStatus]    = useState<'loading'|'found'|'notfound'|'denied'>('loading')
  const [cardHover, setCardHover] = useState<string | null>(null)
  const [viewportH, setViewportH] = useState(window.innerHeight)

  const isPreview = !id || id === 'preview'

  useEffect(() => {
    const sync = () => setViewportH(window.innerHeight)
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [])

  const labels = {
    en: {
      brand:         'GIS Dashboard Builder',
      edit:          'Edit Dashboard',
      share:         'Share',
      previewMode:   'Preview',
      notFoundTitle: 'Dashboard Not Found',
      notFoundBody:  'This dashboard does not exist or may have been deleted.',
      backHome:      'Back to Dashboards',
      openEditor:    'Open Editor',
      noWidgetsTitle:'No widgets yet',
      noWidgetsBody: 'Go to the editor to add charts, maps, and more.',
      previewBanner: 'Preview mode — changes are not yet published.',
    },
    ar: {
      brand:         'GIS Dashboard Builder',
      edit:          'تعديل اللوحة',
      share:         'مشاركة',
      previewMode:   'معاينة',
      notFoundTitle: 'اللوحة غير موجودة',
      notFoundBody:  'هذه اللوحة غير موجودة أو ربما تم حذفها.',
      backHome:      'العودة للوحات',
      openEditor:    'فتح المحرر',
      noWidgetsTitle:'لا توجد ودجت بعد',
      noWidgetsBody: 'اذهب إلى المحرر لإضافة مخططات وخرائط وأكثر.',
      previewBanner: 'وضع المعاينة — التغييرات لم تُنشر بعد.',
    },
  }[lang]

  useEffect(() => {
    if (!isPreview && id) {
      setStatus('loading')
      loadDashboard(id).then(() => {
        const state = useBuilderStore.getState()
        if (state.dashboardId !== id) {
          setStatus('notfound')
        } else if (!state.isPublic && user?.id !== state.ownerId) {
          setStatus('denied')
        } else {
          setStatus('found')
        }
      })
    } else {
      setStatus('found')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const usedCols  = widgets.length ? Math.max(...widgets.map(w => w.x + w.w)) : GRID_COLS
  const usedRows  = widgets.length ? Math.max(...widgets.map(w => w.y + w.h)) : 4
  const colScale  = GRID_COLS / Math.max(usedCols, 1)
  const chromeH   = HEADER_H + (isPreview ? BANNER_H : 0)
  const availH    = viewportH - chromeH
  const viewRowH  = Math.max(80, Math.floor(
    (availH - (usedRows - 1) * CARD_GAP - EDGE_PAD * 2) / usedRows
  ))
  const gridLayout = scaleLayout(widgets, colScale)

  // ── canvas background — iridescent gradient (distinct from builder's dotted grid) ──
  const canvasBg: React.CSSProperties = {
    height:          '100vh',
    display:         'flex',
    flexDirection:   'column',
    overflow:        'hidden',
    background:      '#f6f8ff',
    backgroundImage: [
      'radial-gradient(ellipse at 20% 15%, rgba(199,210,254,0.55) 0%, transparent 45%)',
      'radial-gradient(ellipse at 80% 80%, rgba(167,243,208,0.45) 0%, transparent 45%)',
      'radial-gradient(ellipse at 70% 10%, rgba(251,207,232,0.40) 0%, transparent 38%)',
      'radial-gradient(ellipse at 10% 85%, rgba(254,240,138,0.30) 0%, transparent 40%)',
    ].join(', '),
  }

  if (status === 'loading') return <AppLoader />
  if (status === 'denied')  return <AccessDeniedPage />

  if (status === 'notfound') {
    return (
      <div style={canvasBg}>
        <ViewTopBar title="Dashboard" isPreview={false} dashboardId={dashboardId}
          isOwner={false} labels={labels} lang={lang} toggleLang={toggleLang}
          navigate={navigate} onShare={() => {}} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>🔍</div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 6px' }}>{labels.notFoundTitle}</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>{labels.notFoundBody}</p>
          </div>
          <button onClick={() => navigate('/')} style={{ padding: '8px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '20px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
            {labels.backHome}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={canvasBg}>

      <ViewTopBar
        title={dashboardTitle} isPreview={isPreview} dashboardId={dashboardId}
        isOwner={isOwner} labels={labels} lang={lang} toggleLang={toggleLang}
        navigate={navigate} onShare={() => setShowShare(true)} />

      {/* Preview banner — floating amber pill */}
      {isPreview && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '0 12px 8px', flexShrink: 0 }}>
          <div style={{
            display:              'flex',
            alignItems:           'center',
            gap:                  '8px',
            background:           'rgba(254,243,199,0.92)',
            backdropFilter:       'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border:               '1px solid rgba(253,230,138,0.85)',
            borderRadius:         '40px',
            padding:              '6px 16px',
            boxShadow:            '0 2px 12px rgba(217,119,6,0.12)',
          } as React.CSSProperties}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="#d97706" strokeWidth="1.6">
              <circle cx="7" cy="7" r="6"/>
              <line x1="7" y1="4" x2="7" y2="7.5"/>
              <circle cx="7" cy="10" r="0.5" fill="#d97706"/>
            </svg>
            <span style={{ fontSize: '12px', color: '#92400e', fontWeight: '500' }}>
              {labels.previewBanner}
            </span>
            <button
              onClick={() => navigate(`/builder/${dashboardId}`)}
              style={{ fontSize: '11px', fontWeight: '700', color: '#b45309', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline', marginLeft: '4px' }}
            >
              {labels.edit}
            </button>
          </div>
        </div>
      )}

      {/* Widget grid */}
      <div style={{ flex: 1, overflow: 'auto', height: availH, direction: 'ltr' }}>
        {widgets.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' } as React.CSSProperties}>📊</div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 6px' }}>{labels.noWidgetsTitle}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>{labels.noWidgetsBody}</p>
            </div>
            {isOwner && (
              <button onClick={() => navigate(`/builder/${dashboardId}`)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '20px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 2l2 2-6 6H3V8l6-6z"/></svg>
                {labels.openEditor}
              </button>
            )}
          </div>
        ) : (
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: gridLayout, md: gridLayout, sm: gridLayout }}
            breakpoints={{ lg: 1200, md: 996, sm: 0 }}
            cols={{ lg: GRID_COLS, md: GRID_COLS, sm: GRID_COLS }}
            rowHeight={viewRowH}
            margin={[CARD_GAP, CARD_GAP]}
            containerPadding={[EDGE_PAD, EDGE_PAD]}
            isDraggable={false}
            isResizable={false}
            useCSSTransforms
          >
            {widgets.map(widget => (
              <div
                key={widget.id}
                onMouseEnter={() => setCardHover(widget.id)}
                onMouseLeave={() => setCardHover(null)}
                style={{
                  background:           'rgba(255,255,255,0.92)',
                  backdropFilter:       'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border:               '1px solid rgba(255,255,255,0.95)',
                  borderRadius:         '16px',
                  display:              'flex',
                  flexDirection:        'column',
                  overflow:             'hidden',
                  boxShadow:            cardHover === widget.id
                    ? '0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.07)'
                    : '0 4px 18px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
                  transition:           'box-shadow 0.25s ease, transform 0.2s ease',
                  transform:            cardHover === widget.id ? 'translateY(-3px)' : 'translateY(0)',
                } as React.CSSProperties}
              >
                {/* Title bar */}
                <div style={{ padding: '10px 16px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0, background: 'transparent' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '0.1px' }}>{widget.title}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: '500', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.04)', borderRadius: '20px', padding: '2px 8px', textTransform: 'capitalize', letterSpacing: '0.2px' }}>
                    {widget.type.replace('-', ' ')}
                  </span>
                </div>
                {/* Content */}
                <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
                  {renderWidget(widget)}
                </div>
              </div>
            ))}
          </ResponsiveGridLayout>
        )}
      </div>

      {showShare && <ShareModal dashboardId={dashboardId} onClose={() => setShowShare(false)} />}
    </div>
  )
}

// ── Top Bar ───────────────────────────────────────────────────────────────────
interface ViewTopBarProps {
  title: string; isPreview: boolean; dashboardId: string; isOwner: boolean
  labels: any; lang: string; toggleLang: () => void
  navigate: (to: string) => void; onShare: () => void
}

function ViewTopBar({ title, isPreview, dashboardId, isOwner, labels, lang, toggleLang, navigate, onShare }: ViewTopBarProps) {
  return (
    <header style={{ padding: '10px 12px', display: 'flex', justifyContent: 'center', position: 'sticky', top: 0, zIndex: 200, flexShrink: 0 }}>

      {/* Single compact centered glass bar */}
      <div style={{
        ...GLASS,
        display:      'inline-flex',
        alignItems:   'center',
        gap:          '20px',
        padding:      '6px 10px 6px 6px',
        borderRadius: '20px',
      }}>
        {/* Back — goes to builder in preview mode, home otherwise */}
        <button
          onClick={() => navigate(isPreview ? `/builder/${dashboardId}` : '/')}
          title={isPreview
            ? (lang === 'en' ? 'Back to editor' : 'العودة للمحرر')
            : (lang === 'en' ? 'Back to dashboards' : 'العودة للوحات')}
          style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-secondary)', flexShrink: 0, transition: 'background 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.06)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }}>
            <path d="M11 14L6 9l5-5"/>
          </svg>
        </button>

        {/* Logo */}
        <img src={logoUrl} alt="logo" style={{ width: '26px', height: '26px', borderRadius: '8px', flexShrink: 0, margin: '0 6px' }} />

        {/* Divider */}
        <div style={{ width: '1px', height: '18px', background: 'rgba(0,0,0,0.10)', flexShrink: 0, margin: '0 8px 0 2px' }} />

        {/* Title */}
        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '260px' }}>
          {title}
        </span>

        {/* Preview badge */}
        {isPreview && (
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#d97706', background: 'rgba(254,243,199,0.9)', border: '1px solid rgba(253,230,138,0.8)', borderRadius: '20px', padding: '2px 8px', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: '6px' }}>
            {labels.previewMode}
          </span>
        )}

        {/* Divider between left and right groups */}
        <div style={{ width: '1px', height: '18px', background: 'rgba(0,0,0,0.10)', flexShrink: 0, margin: '0 8px' }} />

        {/* Lang toggle */}
        <button
          onClick={toggleLang}
          title={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
          style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: '50%', cursor: 'pointer', color: 'var(--text-secondary)', flexShrink: 0, transition: 'background 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.06)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </button>

        {/* Share */}
        <button
          onClick={onShare}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px', background: 'transparent', border: 'none', borderRadius: '12px', fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.06)'; e.currentTarget.style.color = 'var(--text-primary)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="11" cy="3" r="1.5"/><circle cx="3" cy="7" r="1.5"/><circle cx="11" cy="11" r="1.5"/>
            <path d="M4.5 6.5l5-2.5M4.5 7.5l5 2.5"/>
          </svg>
          {labels.share}
        </button>

        {/* Edit (owner only) */}
        {isOwner && (
          <button
            onClick={() => navigate(`/builder/${dashboardId}`)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', background: 'var(--accent)', border: 'none', borderRadius: '12px', fontSize: '12px', fontWeight: '600', color: '#fff', cursor: 'pointer', flexShrink: 0, transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
          >
            <svg width="12" height="12" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 2l2 2-6 6H3V8l6-6z"/>
            </svg>
            {labels.edit}
          </button>
        )}
      </div>
    </header>
  )
}
