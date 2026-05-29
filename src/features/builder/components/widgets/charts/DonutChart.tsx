import { DonutChartConfig } from '../../../types/builder.types'
import ReactECharts from 'echarts-for-react'
import { useAggregatedData } from '../../../hooks/useAggregatedData'

interface DonutChartProps {
  config?: Partial<DonutChartConfig>
}

export function DonutChart({ config = {} }: DonutChartProps) {
  const holeSize   = config.holeSize   ?? 50
  const showLabels = config.showLabels !== false
  const showLegend = config.showLegend !== false
  const showTotal  = config.showTotal  ?? true
  const labelType  = config.labelType  ?? 'percent'

  const aggregated = useAggregatedData({
    layerId:     config.layerId,
    xField:      config.categoryField,
    yField:      config.valueField,
    aggregation: config.aggregation ?? 'sum',
  })

  const data = aggregated.length > 0
    ? aggregated.map(item => ({ value: item.y, name: item.x }))
    : [
      { value: 48, name: 'Zone A', itemStyle: { color: '#0ea5e9' } },
      { value: 25, name: 'Zone B', itemStyle: { color: '#22c55e' } },
      { value: 15, name: 'Zone C', itemStyle: { color: '#f59e0b' } },
      { value: 12, name: 'Zone D', itemStyle: { color: '#ef4444' } },
    ]

  const total = data.reduce((sum, d) => sum + d.value, 0)

  const labelFormatter =
    labelType === 'value' ? '{c}' :
    labelType === 'name'  ? '{b}' : '{d}%'

  const option = {
    graphic: showTotal ? [{
      type: 'text',
      left: 'center',
      top: 'center',
      style: { text: `${total}`, fontSize: 18, fontWeight: 'bold', fill: '#111827' },
    }] : [],
    series: [{
      type: 'pie',
      radius: [`${holeSize}%`, '68%'],
      data,
      label: { show: showLabels, formatter: labelFormatter, fontSize: 11, color: '#6b7280' },
      emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.1)' } },
    }],
    tooltip: { trigger: 'item' },
    legend: { show: showLegend, bottom: 0, textStyle: { fontSize: 10, color: '#9ca3af' } },
  }

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
}

export default DonutChart
 