import ReactECharts from 'echarts-for-react'
import { useAggregatedData } from '../../../hooks/useAggregatedData'
import { AreaChartConfig } from '../../../types/builder.types'
 
interface AreaChartProps {
  config?: Partial<AreaChartConfig>
}
 
export function AreaChart({ config = {} }: AreaChartProps) {
  const color       = config.color          ?? '#0ea5e9'
  const thickness   = config.lineThickness  ?? 2
  const smooth      = config.smooth         !== false
  const showDots    = config.showDots       ?? false
  const fillOpacity = (config.fillOpacity   ?? 20) / 100
 
  const aggregated = useAggregatedData({
    layerId:     config.layerId,
    xField:      config.xField,
    yField:      config.yField,
    aggregation: config.aggregation ?? 'sum',
  })

  const data = aggregated.length > 0 ? aggregated.map(item => item.y) : [2200, 3800, 4200, 4800, 4500, 5200, 4800, 3200]
  const xData = aggregated.length > 0 ? aggregated.map(item => item.x) : ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
 
  const alphaHex = Math.round(fillOpacity * 255).toString(16).padStart(2, '0')
 
  const option = {
    grid: { top: 16, right: 16, bottom: 32, left: 40 },
    xAxis: {
      type: 'category',
      data: ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#9ca3af', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#f3f4f6' } },
      axisLabel: { color: '#9ca3af', fontSize: 11 },
    },
    series: [{
      type: 'line',
      data,
      smooth,
      itemStyle: { color },
      lineStyle: { color, width: thickness },
      areaStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: `${color}${alphaHex}` },
            { offset: 1, color: `${color}00` },
          ],
        },
      },
      symbol: showDots ? 'circle' : 'none',
      symbolSize: 6,
      markLine: config.showAverage ? {
        data: [{ type: 'average' }],
        lineStyle: { color: '#ef4444', type: 'dashed' },
      } : undefined,
    }],
    tooltip: { trigger: 'axis' },
  }
 
  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
}
 
export default AreaChart