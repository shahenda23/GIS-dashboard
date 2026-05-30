import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import logoUrl from '../assets/logo.svg'
import AppLoader from '../components/AppLoader'
import { Responsive, WidthProvider } from 'react-grid-layout/legacy'
import type { LayoutItem } from 'react-grid-layout/legacy'
import { useBuilderStore } from '../features/builder/store/builderStore'
import { Widget } from '../features/builder/types/builder.types'
import MapWidget from '../features/builder/components/widgets/MapWidget'
import ChartWidget from '../features/builder/components/widgets/ChartWidget'
import TableWidget from '../features/builder/components/widgets/TableWidget'
import KPIWidget from '../features/builder/components/widgets/KPIWidget'
import FilterWidget from '../features/builder/components/widgets/FilterWidget'
import ShareModal from '../features/dashboard/components/ShareModal'
import { useTheme } from '../context/ThemeContext'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

// ── Constants ────────────────────────────────────────────────────────────────
const HEADER_H  = 64
const BANNER_H  = 36
const CARD_GAP  = 16   // المسافة بين الـ cards
const EDGE_PAD  = 50   // الـ padding على الحواف (فوق / تحت / يمين / شمال)
const GRID_COLS = 12


function renderWidget(widget: Widget) {
  const cfg = widget.config ?? {}
  if (widget.type === 'map')    return <MapWidget widgetId={widget.id} config={cfg as any} />
  if (widget.type === 'table')  return <TableWidget config={cfg as any} />
  if (widget.type === 'kpi')    return <KPIWidget config={cfg as any} />
  if (widget.type === 'filter') return <FilterWidget />
  return <ChartWidget type={widget.type} config={cfg as any} />
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// Scale layout positions to fill GRID_COLS columns proportionally.
// If widgets only span 8 cols, scale by 12/8 so they fill the screen.
function scaleLayout(widgets: Widget[], colScale: number): LayoutItem[] {
  return widgets.map(w => {
    const scaledX     = Math.round(w.x * colScale)
    const scaledRight = Math.round((w.x + w.w) * colScale)
    return {
      i:      w.id,
      x:      scaledX,
      w:      Math.max(1, scaledRight - scaledX),
      y:      w.y,
      h:      w.h,
      static: true,
    }
  })
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DashboardViewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lang, toggleLang } = useTheme()
  const { widgets, layers, dashboardTitle, dashboardId, loadDashboard, isLoading, updatedAt } = useBuilderStore()
  const [showShare,  setShowShare]  = useState(false)
  const [notFound,   setNotFound]   = useState(false)
  const [cardHover,  setCardHover]  = useState<string | null>(null)
  const [viewportH,  setViewportH]  = useState(window.innerHeight)

  const isPreview = !id || id === 'preview'

  // Keep viewport height in sync on resize
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
      updated:       'Updated',
      previewMode:   'Preview',
      notFoundTitle: 'Dashboard Not Found',
      notFoundBody:  'This dashboard does not exist or may have been deleted.',
      backHome:      'Back to Dashboards',
      openEditor:    'Open Editor',
      noWidgetsTitle:'No widgets yet',
      noWidgetsBody: 'Go to the editor to add charts, maps, and more.',
      widgets:       (n: number) => `${n} widget${n !== 1 ? 's' : ''}`,
      layers:        (n: number) => `${n} layer${n !== 1 ? 's' : ''}`,
    },
    ar: {
      brand:         'GIS Dashboard Builder',
      edit:          'تعديل اللوحة',
      share:         'مشاركة',
      updated:       'تحديث',
      previewMode:   'معاينة',
      notFoundTitle: 'اللوحة غير موجودة',
      notFoundBody:  'هذه اللوحة غير موجودة أو ربما تم حذفها.',
      backHome:      'العودة للوحات',
      openEditor:    'فتح المحرر',
      noWidgetsTitle:'لا توجد ودجت بعد',
      noWidgetsBody: 'اذهب إلى المحرر لإضافة مخططات وخرائط وأكثر.',
      widgets:       (n: number) => `${n} ودجت`,
      layers:        (n: number) => `${n} طبقة`,
    },
  }[lang]

  // Load dashboard data from Supabase
  useEffect(() => {
    if (!isPreview && id) {
      setNotFound(false)
      loadDashboard(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  // Detect not-found after load completes
  useEffect(() => {
    if (!isPreview && id && !isLoading && dashboardId !== id) {
      setNotFound(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  // ── Grid scaling ────────────────────────────────────────────────────────────
  // usedCols: how many columns the widgets actually occupy (e.g. 8 out of 12)
  // colScale: multiply every x and w so they fill all 12 columns
  const usedCols = widgets.length ? Math.max(...widgets.map(w => w.x + w.w)) : GRID_COLS
  const usedRows = widgets.length ? Math.max(...widgets.map(w => w.y + w.h)) : 4
  const colScale = GRID_COLS / Math.max(usedCols, 1)

  // rowHeight: fill the available viewport height exactly
  const chromeH  = HEADER_H + (isPreview ? BANNER_H : 0)
  const availH   = viewportH - chromeH
  // subtract row gaps + top/bottom edge padding from available height
  const viewRowH = Math.max(80, Math.floor(
    (availH - (usedRows - 1) * CARD_GAP - EDGE_PAD * 2) / usedRows
  ))

  const gridLayout = scaleLayout(widgets, colScale)

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (!isPreview && isLoading) return <AppLoader />

  // ── Not Found ───────────────────────────────────────────────────────────────
  if (notFound) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--page-bg)' }}>
        <TopBar
          title="Dashboard" isPreview={false} dashboardId={dashboardId}
          widgetCount={0} layerCount={0} updatedAt={null}
          labels={labels} lang={lang} toggleLang={toggleLang}
          navigate={navigate} onShare={() => {}}        />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px' }}>🔍</div>
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 6px' }}>{labels.notFoundTitle}</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0 }}>{labels.notFoundBody}</p>
          </div>
          <button onClick={() => navigate('/')} style={{ padding: '8px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
            {labels.backHome}
          </button>
        </div>
      </div>
    )
  }

  // ── Main View ───────────────────────────────────────────────────────────────
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--page-bg)' }}>

      <TopBar
        title={dashboardTitle} isPreview={isPreview} dashboardId={dashboardId}
        widgetCount={widgets.length} layerCount={layers.length} updatedAt={updatedAt}
        labels={labels} lang={lang} toggleLang={toggleLang}
        navigate={navigate} onShare={() => setShowShare(true)}      />

      {/* Preview banner */}
      {isPreview && (
        <div style={{ background: 'linear-gradient(90deg, #fffbeb, #fef3c7)', borderBottom: '1px solid #fde68a', padding: '7px 24px', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#d97706" strokeWidth="1.6">
            <circle cx="7" cy="7" r="6"/>
            <line x1="7" y1="4" x2="7" y2="7.5"/>
            <circle cx="7" cy="10" r="0.5" fill="#d97706"/>
          </svg>
          <span style={{ fontSize: '12px', color: '#92400e', fontWeight: '500' }}>
            {lang === 'en' ? 'You are viewing a preview. Changes are not yet published.' : 'أنت في وضع المعاينة. التغييرات لم تُنشر بعد.'}
          </span>
          <button onClick={() => navigate(`/builder/${dashboardId}`)} style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: '600', color: '#d97706', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            {labels.edit}
          </button>
        </div>
      )}

      {/* Widget grid — fills remaining screen, scrollable if content exceeds viewport */}
      <div style={{ flex: 1, overflow: 'auto', height: availH, direction: 'ltr' }}>
        {widgets.length === 0 ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>📊</div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 6px' }}>{labels.noWidgetsTitle}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>{labels.noWidgetsBody}</p>
            </div>
            <button onClick={() => navigate(`/builder/${dashboardId}`)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 2l2 2-6 6H3V8l6-6z"/></svg>
              {labels.openEditor}
            </button>
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
                  background:    'var(--surface)',
                  border:        '1px solid var(--border)',
                  borderRadius:  'var(--radius-lg)',
                  display:       'flex',
                  flexDirection: 'column',
                  overflow:      'hidden',
                  boxShadow:     cardHover === widget.id
                    ? '0 4px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)'
                    : '0 1px 4px rgba(0,0,0,0.05)',
                  transition:    'box-shadow 0.2s ease, transform 0.15s ease',
                  transform:     cardHover === widget.id ? 'translateY(-1px)' : 'translateY(0)',
                }}
              >
                {/* Title bar */}
                <div style={{ padding: '9px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0, background: 'var(--surface)' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '0.1px' }}>{widget.title}</span>
                  <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: '500', color: 'var(--text-muted)', background: 'var(--page-bg)', border: '1px solid var(--border)', borderRadius: '4px', padding: '1px 6px', textTransform: 'capitalize' }}>
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
interface TopBarProps {
  title: string; isPreview: boolean; dashboardId: string
  widgetCount: number; layerCount: number; updatedAt: string | null
  labels: any; lang: string; toggleLang: () => void
  navigate: (to: string) => void; onShare: () => void
}

function TopBar({ title, isPreview, dashboardId, widgetCount, layerCount, updatedAt, labels, lang, toggleLang, navigate, onShare }: TopBarProps) {
  const [editHover,  setEditHover]  = useState(false)
  const [shareHover, setShareHover] = useState(false)
  const [backHover,  setBackHover]  = useState(false)

  return (
    <header style={{ height: `${HEADER_H}px`, background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0, zIndex: 200, boxShadow: '0 1px 0 var(--border)' }}>

      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center' }}>

        <button
          onClick={() => navigate('/')}
          onMouseEnter={() => setBackHover(true)}
          onMouseLeave={() => setBackHover(false)}
          title={lang === 'en' ? 'Back to dashboards' : 'العودة للوحات'}
          style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: backHover ? 'var(--page-bg)' : 'transparent', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', marginRight: '6px', transition: 'background 0.15s', color: 'var(--text-secondary)', flexShrink: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" style={{ transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }}><path d="M11 14L6 9l5-5"/></svg>
        </button>

        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginRight: '16px' }}>
          <img src={logoUrl} alt="logo" style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)', flexShrink: 0 }} />
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{labels.brand}</span>
        </div>

        <div style={{ width: '1px', height: '22px', background: 'var(--border)', marginRight: '16px', flexShrink: 0 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1 }}>{title}</span>
            {isPreview && (
              <span style={{ fontSize: '10px', fontWeight: '700', color: '#d97706', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '10px', padding: '1px 8px', letterSpacing: '0.3px' }}>
                {labels.previewMode}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
            {updatedAt && <span>{labels.updated} {relativeTime(updatedAt)}</span>}
            {updatedAt && <span style={{ opacity: 0.4 }}>·</span>}
            <span>{labels.widgets(widgetCount)}</span>
            {layerCount > 0 && <><span style={{ opacity: 0.4 }}>·</span><span>{labels.layers(layerCount)}</span></>}
          </div>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        <button onClick={toggleLang} title={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'} style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </button>

        <button
          onClick={onShare}
          onMouseEnter={() => setShareHover(true)}
          onMouseLeave={() => setShareHover(false)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: shareHover ? 'var(--page-bg)' : 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '500', color: shareHover ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="11" cy="3" r="1.5"/><circle cx="3" cy="7" r="1.5"/><circle cx="11" cy="11" r="1.5"/>
            <path d="M4.5 6.5l5-2.5M4.5 7.5l5 2.5"/>
          </svg>
          {labels.share}
        </button>

        <button
          onClick={() => navigate(`/builder/${dashboardId}`)}
          onMouseEnter={() => setEditHover(true)}
          onMouseLeave={() => setEditHover(false)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', background: editHover ? 'var(--accent-hover)' : 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '600', color: '#fff', cursor: 'pointer', transition: 'background 0.15s', boxShadow: '0 1px 3px rgba(14,165,233,0.3)' }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 2l2 2-6 6H3V8l6-6z"/></svg>
          {labels.edit}
        </button>

      </div>
    </header>
  )
}
