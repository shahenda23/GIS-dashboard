import type { ReactNode } from 'react'
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
import { WidgetType } from '../types/builder.types'

const S = { width: '15px', height: '15px', flexShrink: 0 } as const

type WidgetEntry = { type: string; labelEn: string; labelAr: string; icon: ReactNode }

const widgetTypes: WidgetEntry[] = [
  { type: 'map',           labelEn: 'Map',     labelAr: 'خريطة', icon: <MapIcon     style={S} /> },
  { type: 'bar-chart',     labelEn: 'Bar',     labelAr: 'أعمدة', icon: <BarIcon     style={S} /> },
  { type: 'line-chart',    labelEn: 'Line',    labelAr: 'خط',    icon: <LineIcon    style={S} /> },
  { type: 'pie-chart',     labelEn: 'Pie',     labelAr: 'دائري', icon: <PieIcon     style={S} /> },
  { type: 'donut-chart',   labelEn: 'Donut',   labelAr: 'حلقي',  icon: <DonutIcon   style={S} /> },
  { type: 'area-chart',    labelEn: 'Area',    labelAr: 'مساحة', icon: <AreaIcon    style={S} /> },
  { type: 'scatter-chart', labelEn: 'Scatter', labelAr: 'نقاط',  icon: <ScatterIcon style={S} /> },
  { type: 'table',         labelEn: 'Table',   labelAr: 'جدول',  icon: <TableIcon   style={S} /> },
  { type: 'kpi',           labelEn: 'KPI',     labelAr: 'مؤشر',  icon: <KpiIcon     style={S} /> },
  { type: 'filter',        labelEn: 'Filter',  labelAr: 'فلتر',  icon: <FilterIcon  style={S} /> },
]

function WidgetToolbar() {
  const { lang } = useTheme()
  const { addWidget } = useBuilderStore()

  function handleAdd(type: WidgetType, labelEn: string, labelAr: string) {
    addWidget({
      id: `widget-${Date.now()}`,
      type,
      title: lang === 'en' ? labelEn : labelAr,
      x: 0,
      y: 0,
      w: type === 'map' ? 8 : type === 'kpi' ? 3 : 4,
      h: type === 'kpi' ? 2 : type === 'map' ? 5 : 3,
      minW: 2,
      minH: 2,
      config: {},
    })
  }

  return (
    <div style={{
      height: '44px',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 16px',
      gap: '4px',
      direction: lang === 'ar' ? 'rtl' : 'ltr',
    }}>
      {widgetTypes.map(w => (
        <button
          key={w.type}
          onClick={() => handleAdd(w.type as WidgetType, w.labelEn, w.labelAr)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 12px',
            background: 'transparent',
            border: '1px solid transparent',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            fontWeight: '500',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--page-bg)'
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.color = 'var(--text-primary)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'transparent'
            e.currentTarget.style.color = 'var(--text-secondary)'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center' }}>{w.icon}</span>
          {lang === 'en' ? w.labelEn : w.labelAr}
        </button>
      ))}
    </div>
  )
}

export default WidgetToolbar
