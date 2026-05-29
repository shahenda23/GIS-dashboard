import { PieChartConfig } from '../../../types/builder.types'
import ReactECharts from 'echarts-for-react'
import { useAggregatedData } from '../../../hooks/useAggregatedData'
 
interface PieChartProps {
  config?: Partial<PieChartConfig>
}
 
export function PieChart({ config = {} }: PieChartProps) {
  const showLabels = config.showLabels !== false
  const showLegend = config.showLegend !== false
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
      { value: 35, name: 'Residential', itemStyle: { color: '#0ea5e9' } },
      { value: 25, name: 'Commercial',  itemStyle: { color: '#22c55e' } },
      { value: 20, name: 'Industrial',  itemStyle: { color: '#f59e0b' } },
      { value: 20, name: 'Green Areas', itemStyle: { color: '#8b5cf6' } },
    ]

  const labelFormatter =
    labelType === 'value' ? '{c}' :
    labelType === 'name'  ? '{b}' : '{d}%'

  const option = {
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      data,
      label: { show: showLabels, formatter: labelFormatter, fontSize: 11, color: '#6b7280' },
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.1)' },
        scaleSize: config.highlightLargest ? 8 : 4,
      },
    }],
    tooltip: { trigger: 'item' },
    legend: { show: showLegend, bottom: 0, textStyle: { fontSize: 10, color: '#9ca3af' } },
  }

  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
}
 
export default PieChart