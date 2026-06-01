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

const IS = { width: '17px', height: '17px', flexShrink: 0 } as const

type DockEntry = {
  type: WidgetType
  labelEn: string
  labelAr: string
  icon: ReactNode
  bg: string
  color: string
}

const dockItems: DockEntry[] = [
  { type: 'map',           labelEn: 'Map',     labelAr: 'خريطة', icon: <MapIcon     style={IS} />, bg: '#dbeafe', color: '#3b82f6' },
  { type: 'bar-chart',     labelEn: 'Bar',     labelAr: 'أعمدة', icon: <BarIcon     style={IS} />, bg: '#dcfce7', color: '#16a34a' },
  { type: 'line-chart',    labelEn: 'Line',    labelAr: 'خط',    icon: <LineIcon    style={IS} />, bg: '#fef3c7', color: '#d97706' },
  { type: 'pie-chart',     labelEn: 'Pie',     labelAr: 'دائري', icon: <PieIcon     style={IS} />, bg: '#fce7f3', color: '#db2777' },
  { type: 'donut-chart',   labelEn: 'Donut',   labelAr: 'حلقي',  icon: <DonutIcon   style={IS} />, bg: '#ede9fe', color: '#7c3aed' },
  { type: 'area-chart',    labelEn: 'Area',    labelAr: 'مساحة', icon: <AreaIcon    style={IS} />, bg: '#d1fae5', color: '#059669' },
  { type: 'scatter-chart', labelEn: 'Scatter', labelAr: 'نقاط',  icon: <ScatterIcon style={IS} />, bg: '#fef9c3', color: '#b45309' },
  { type: 'table',         labelEn: 'Table',   labelAr: 'جدول',  icon: <TableIcon   style={IS} />, bg: '#e0f2fe', color: '#0284c7' },
  { type: 'kpi',           labelEn: 'KPI',     labelAr: 'مؤشر',  icon: <KpiIcon     style={IS} />, bg: '#ffedd5', color: '#ea580c' },
  { type: 'filter',        labelEn: 'Filter',  labelAr: 'فلتر',  icon: <FilterIcon  style={IS} />, bg: '#f1f5f9', color: '#475569' },
]

function WidgetDock() {
  const { lang } = useTheme()
  const { addWidget } = useBuilderStore()

  function handleAdd(item: DockEntry) {
    addWidget({
      id:    `widget-${Date.now()}`,
      type:  item.type,
      title: lang === 'en' ? item.labelEn : item.labelAr,
      x: 0, y: 0,
      w: item.type === 'map' ? 8 : item.type === 'kpi' ? 3 : 4,
      h: item.type === 'kpi' ? 2 : item.type === 'map' ? 5 : 3,
      minW: 2, minH: 2,
      config: {},
    })
  }

  return (
    <div style={{
      display:              'inline-flex',
      alignItems:           'center',
      gap:                  '8px',
      padding:              '10px 18px',
      background:           'rgba(255, 255, 255, 0.88)',
      backdropFilter:       'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border:               '1.5px solid rgba(255, 255, 255, 0.95)',
      borderRadius:         '40px',
      boxShadow:            '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
      direction:            lang === 'ar' ? 'rtl' : 'ltr',
    } as React.CSSProperties}>
      {dockItems.map(item => (
        <button
          key={item.type}
          className="dock-item"
          onClick={() => handleAdd(item)}
          title={lang === 'en' ? item.labelEn : item.labelAr}
          style={{
            width:           '40px',
            height:          '40px',
            borderRadius:    '50%',
            background:      item.bg,
            border:          'none',
            cursor:          'pointer',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            color:           item.color,
            flexShrink:      0,
          }}
        >
          {item.icon}
        </button>
      ))}
    </div>
  )
}

export default WidgetDock
