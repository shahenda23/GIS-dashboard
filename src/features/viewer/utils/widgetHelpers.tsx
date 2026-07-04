import type { LayoutItem } from 'react-grid-layout/legacy'
import { Widget } from '../../builder/types/builder.types'
import LazyMapWidget from '../../builder/components/widgets/LazyMapWidget'
import ChartWidget from '../../builder/components/widgets/ChartWidget'
import TableWidget from '../../builder/components/widgets/TableWidget'
import KPIWidget from '../../builder/components/widgets/KPIWidget'
import FilterWidget from '../../builder/components/widgets/FilterWidget'

const GRID_COLS = 12

export function renderWidget(widget: Widget) {
  const cfg = widget.config ?? {}
  if (widget.type === 'map')    return <LazyMapWidget widgetId={widget.id} config={cfg as any} />
  if (widget.type === 'table')  return <TableWidget config={cfg as any} />
  if (widget.type === 'kpi')    return <KPIWidget config={cfg as any} />
  if (widget.type === 'filter') return <FilterWidget />
  return <ChartWidget type={widget.type} config={cfg as any} />
}

export function scaleLayout(widgets: Widget[], colScale: number): LayoutItem[] {
  return widgets.map(w => {
    const scaledX     = Math.round(w.x * colScale)
    const scaledRight = Math.round((w.x + w.w) * colScale)
    return { i: w.id, x: scaledX, w: Math.max(1, scaledRight - scaledX), y: w.y, h: w.h, static: true }
  })
}

export function calcLayout(widgets: Widget[], viewportH: number, headerH: number) {
  const CARD_GAP = 16
  const EDGE_PAD = 40
  const usedCols  = widgets.length ? Math.max(...widgets.map(w => w.x + w.w)) : GRID_COLS
  const usedRows  = widgets.length ? Math.max(...widgets.map(w => w.y + w.h)) : 4
  const colScale  = GRID_COLS / Math.max(usedCols, 1)
  const availH    = viewportH - headerH
  const viewRowH  = Math.max(80, Math.floor(
    (availH - (usedRows - 1) * CARD_GAP - EDGE_PAD * 2) / usedRows
  ))
  return { colScale, availH, viewRowH, gridLayout: scaleLayout(widgets, colScale), CARD_GAP, EDGE_PAD, GRID_COLS }
}
