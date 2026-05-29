import { LineChartConfig } from '../../../types/builder.types'
import ReactECharts from 'echarts-for-react'
import { useAggregatedData } from '../../../hooks/useAggregatedData'
 
interface LineChartProps {
  config?: Partial<LineChartConfig>
}
 
function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}
 
export function LineChart({ config = {} }: LineChartProps) {
  const color     = config.color          ?? '#0ea5e9'
  const thickness = config.lineThickness  ?? 2
  const smooth    = config.smooth         !== false
  const showDots  = config.showDots       !== false
  const showArea  = config.showArea       ?? false
  const opacity   = (config.areaOpacity   ?? 10) / 100

  const aggregated = useAggregatedData({
    layerId:     config.layerId,
    xField:      config.xField,
    yField:      config.yField,
    aggregation: config.aggregation ?? 'sum',
  })

  const data = aggregated.length > 0 ? aggregated.map(item => item.y) : [820, 932, 901, 934, 1290, 1330]
  const xData = aggregated.length > 0 ? aggregated.map(item => item.x) : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  const avg  = data.reduce((a, b) => a + b, 0) / data.length
 
  const option = {
    grid: { top: 16, right: 16, bottom: 32, left: 40 },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#9ca3af', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#f3f4f6' } },
      axisLabel: { color: '#9ca3af', fontSize: 11 },
    },
    series: [
      {
        type: 'line',
        data,
        smooth,
        itemStyle: { color },
        lineStyle: { color, width: thickness },
        areaStyle: showArea
          ? { color: `rgba(${hexToRgb(color)},${opacity})` }
          : undefined,
        symbol: showDots ? 'circle' : 'none',
        symbolSize: 6,
        markLine: config.showAverage ? {
          data: [{ type: 'average', label: { formatter: 'Avg' } }],
          lineStyle: { color: '#ef4444', type: 'dashed' },
        } : undefined,
      },
    ],
    tooltip: { trigger: 'axis' },
  }
 
  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
}
 
export default LineChart