import { useTheme } from '../../../../context/ThemeContext'
import { useBuilderStore } from '../../store/builderStore'
import BarChartSettings from './charts/BarChartSettings'
import LineChartSettings from './charts/LineChartSettings'
import PieChartSettings from './charts/PieChartSettings'
import AreaChartSettings from './charts/AreaChartSettings'
import DonutChartSettings from './charts/DonutChartSettings'
import ScatterChartSettings from './charts/ScatterChartSettings'
import MapSettings from './map/MapSettings'
import KPISettings from './kpi/KPISettings'
import TableSettings from './table/TableSettings'
import FilterSettings from './filter/FilterSettings'


function SettingsPanel() {
  const { lang } = useTheme()
  const selectedWidgetId = useBuilderStore(s => s.selectedWidgetId)
  const selectedWidget   = useBuilderStore(s => s.widgets.find(w => w.id === s.selectedWidgetId))
  const selectWidget     = useBuilderStore(s => s.selectWidget)
  const removeWidget     = useBuilderStore(s => s.removeWidget)

  const t = {
    en: { title: 'Widget Settings', noSelection: 'Select a widget to edit its settings', delete: 'Delete Widget' },
    ar: { title: 'إعدادات الودجت', noSelection: 'اختر ودجتاً لتعديل إعداداته', delete: 'حذف الودجت' },
  }[lang]

  function renderSettings() {
    if (!selectedWidget) return null
    const config = selectedWidget.config ?? {}
    

    switch (selectedWidget.type) {
      case 'map':           return <MapSettings widgetId={selectedWidget.id} config={config as any} />
      case 'bar-chart':     return <BarChartSettings widgetId={selectedWidget.id} config={config as any} />
      case 'line-chart':    return <LineChartSettings widgetId={selectedWidget.id} config={config as any} />
      case 'pie-chart':     return <PieChartSettings widgetId={selectedWidget.id} config={config as any} />
      case 'area-chart':    return <AreaChartSettings widgetId={selectedWidget.id} config={config as any} />
      case 'donut-chart':   return <DonutChartSettings widgetId={selectedWidget.id} config={config as any} />
      case 'scatter-chart': return <ScatterChartSettings widgetId={selectedWidget.id} config={config as any} />
      case 'kpi':           return <KPISettings widgetId={selectedWidget.id} config={config as any} />
      case 'table':         return <TableSettings widgetId={selectedWidget.id} config={config as any} />
      case 'filter':        return <FilterSettings widgetId={selectedWidget.id} config={config as any} />
      default:              return null
    }
  }

  return (
    <aside style={{
      width:                '260px',
      background:           'rgba(255,255,255,0.80)',
      backdropFilter:       'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border:               '1px solid rgba(255,255,255,0.88)',
      borderRadius:         '12px',
      boxShadow:            '0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
      display:              'flex',
      flexDirection:        'column',
      flexShrink:           0,
      marginBottom:         '8px',
    } as React.CSSProperties}>

      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--accent)" strokeWidth="1.5">
          <circle cx="7" cy="7" r="2"/>
          <path d="M7 1v2M7 11v2M1 7h2M11 7h2"/>
        </svg>
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
          {t.title}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {!selectedWidget ? (
          <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ marginBottom: '10px', opacity: 0.4 }}>
              <rect x="4" y="4" width="12" height="12" rx="2"/>
              <rect x="20" y="4" width="12" height="12" rx="2"/>
              <rect x="4" y="20" width="12" height="12" rx="2"/>
              <rect x="20" y="20" width="12" height="12" rx="2"/>
            </svg>
            <p style={{ fontSize: '12px', lineHeight: '1.6' }}>{t.noSelection}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Widget Title */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {lang === 'en' ? 'Title' : 'العنوان'}
              </label>
              <input
                value={selectedWidget.title}
                onChange={e => {
                  useBuilderStore.setState(state => ({
                    widgets: state.widgets.map(w =>
                      w.id === selectedWidgetId ? { ...w, title: e.target.value } : w
                    ),
                    isSaved: false,
                  }))
                }}
                style={{
                  width: '100%', padding: '7px 10px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12px', color: 'var(--text-primary)',
                  background: 'var(--page-bg)', outline: 'none',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Widget-specific settings */}
            {renderSettings()}

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--border)' }} />

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--border)' }} />

            {/* Delete */}
            <button
              onClick={() => { removeWidget(selectedWidget.id); selectWidget(null) }}
              style={{
                width: '100%', padding: '8px',
                background: 'transparent',
                border: '1px solid #fca5a5',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px', fontWeight: '500',
                color: '#ef4444', cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {t.delete}
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default SettingsPanel