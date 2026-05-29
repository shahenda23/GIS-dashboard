import { useCallback } from 'react'
import type { ReactNode } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout/legacy'
import type { Layout, LayoutItem } from 'react-grid-layout/legacy'
import { ReactComponent as MapIcon }      from '../../../assets/icons/map.svg'
import { ReactComponent as BarIcon }      from '../../../assets/icons/bar-chart.svg'
import { ReactComponent as LineIcon }     from '../../../assets/icons/line-chart.svg'
import { ReactComponent as PieIcon }      from '../../../assets/icons/pie-chart.svg'
import { ReactComponent as DonutIcon }    from '../../../assets/icons/donut-chart.svg'
import { ReactComponent as AreaIcon }     from '../../../assets/icons/area-chart.svg'
import { ReactComponent as ScatterIcon }  from '../../../assets/icons/scatter-chart.svg'
import { ReactComponent as TableIcon }    from '../../../assets/icons/table.svg'
import { ReactComponent as KpiIcon }      from '../../../assets/icons/kpi.svg'
import { ReactComponent as FilterIcon }   from '../../../assets/icons/filter.svg'
import { useTheme } from '../../../context/ThemeContext'
import { useBuilderStore } from '../store/builderStore'
import { Widget, WidgetType } from '../types/builder.types'
import MapWidget from './widgets/MapWidget'
import ChartWidget from './widgets/ChartWidget'
import TableWidget from './widgets/TableWidget'
import KPIWidget from './widgets/KPIWidget'
import FilterWidget from './widgets/FilterWidget'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ICON_S = { width: '14px', height: '14px', flexShrink: 0 } as const

const ResponsiveGridLayout = WidthProvider(Responsive)

function renderWidgetContent(widget: Widget) {
  const config = widget.config ?? {}

  if (widget.type === 'map')    return <MapWidget widgetId={widget.id} config={config as any} />
  if (widget.type === 'table')  return <TableWidget config={config as any} />
  if (widget.type === 'kpi')    return <KPIWidget config={config as any} />
  if (widget.type === 'filter') return <FilterWidget />
  return <ChartWidget type={widget.type} config={config as any} />
}

function WidgetCanvas() {
  const { lang } = useTheme()
  const {
    widgets,
    selectedWidgetId,
    selectWidget,
    removeWidget,
    updateLayout,
  } = useBuilderStore()

  const t = {
    en: {
      empty: 'Add your first widget',
      emptySub: 'Use the toolbar above to add a map, chart, or table',
    },
    ar: {
      empty: 'أضف أول ودجت',
      emptySub: 'استخدم شريط الأدوات لإضافة خريطة أو مخطط أو جدول',
    },
  }[lang]

  const widgetIcons: Record<WidgetType, ReactNode> = {
    map:            <MapIcon     style={ICON_S} />,
    'bar-chart':    <BarIcon     style={ICON_S} />,
    'line-chart':   <LineIcon    style={ICON_S} />,
    'pie-chart':    <PieIcon     style={ICON_S} />,
    'donut-chart':  <DonutIcon   style={ICON_S} />,
    'area-chart':   <AreaIcon    style={ICON_S} />,
    'scatter-chart':<ScatterIcon style={ICON_S} />,
    table:          <TableIcon   style={ICON_S} />,
    kpi:            <KpiIcon     style={ICON_S} />,
    filter:         <FilterIcon  style={ICON_S} />,
  }

  const layout: LayoutItem[] = widgets.map(w => ({
    i: w.id,
    x: w.x,
    y: w.y,
    w: w.w,
    h: w.h,
    minW: w.minW ?? 2,
    minH: w.minH ?? 2,
  }))

  const handleLayoutChange = useCallback(
    (currentLayout: Layout) => {
      updateLayout(
        currentLayout.map((l: LayoutItem) => ({
          i: l.i,
          x: l.x,
          y: l.y,
          w: l.w,
          h: l.h,
        }))
      )
    },
    [updateLayout]
  )

  return (
    <div
      onClick={() => selectWidget(null)}
      style={{
        flex: 1,
        background: 'var(--page-bg)',
        overflow: 'auto',
        position: 'relative',
        direction: 'ltr',
      }}
    >
      {widgets.length === 0 ? (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          gap: '10px',
          pointerEvents: 'none',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: '1.5px dashed var(--border-strong)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
          }}>
            +
          </div>
          <p style={{
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--text-secondary)',
          }}>
            {t.empty}
          </p>
          <p style={{
            fontSize: '12px',
            maxWidth: '260px',
            textAlign: 'center',
            lineHeight: '1.5',
          }}>
            {t.emptySub}
          </p>
        </div>
      ) : (
        <ResponsiveGridLayout
          className="layout"
          layouts={{ lg: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768 }}
          cols={{ lg: 12, md: 10, sm: 6 }}
          rowHeight={80}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".widget-drag-handle"
          style={{ minHeight: '100%', padding: '16px' }}
        >
          {widgets.map(widget => (
            <div
              key={widget.id}
              onClick={e => { e.stopPropagation(); selectWidget(widget.id) }}
              style={{
                background: 'var(--surface)',
                border: `1.5px solid ${selectedWidgetId === widget.id
                  ? 'var(--accent)'
                  : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                cursor: 'default',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                boxShadow: selectedWidgetId === widget.id
                  ? '0 0 0 3px var(--accent-light)'
                  : 'none',
              }}
            >
              {/* Widget header — drag handle */}
              <div
                className="widget-drag-handle"
                style={{
                  padding: '8px 12px',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  cursor: 'grab',
                  background: 'var(--surface)',
                  flexShrink: 0,
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <svg width="10" height="14" viewBox="0 0 10 14" fill="var(--text-muted)">
                    <circle cx="2" cy="2"  r="1.5"/>
                    <circle cx="8" cy="2"  r="1.5"/>
                    <circle cx="2" cy="7"  r="1.5"/>
                    <circle cx="8" cy="7"  r="1.5"/>
                    <circle cx="2" cy="12" r="1.5"/>
                    <circle cx="8" cy="12" r="1.5"/>
                  </svg>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {widgetIcons[widget.type]}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'var(--text-primary)',
                  }}>
                    {widget.title}
                  </span>
                </div>

                <button
                  onClick={e => { e.stopPropagation(); removeWidget(widget.id) }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '16px',
                    lineHeight: 1,
                    padding: '0 2px',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  ×
                </button>
              </div>

              {/* Widget content */}
              <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
                {renderWidgetContent(widget)}
              </div>
            </div>
          ))}
        </ResponsiveGridLayout>
      )}
    </div>
  )
}

export default WidgetCanvas