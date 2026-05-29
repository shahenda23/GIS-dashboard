import ReactECharts from 'echarts-for-react'
import { useAggregatedData } from '../../../hooks/useAggregatedData'
import { ScatterChartConfig } from '../../../types/builder.types'
 
interface ScatterChartProps {
  config?: Partial<ScatterChartConfig>
}
 
export function ScatterChart({ config = {} }: ScatterChartProps) {
  const color   = config.color         ?? '#0ea5e9'
  const size    = config.pointSize     ?? 8
  const opacity = (config.pointOpacity ?? 70) / 100
 
  const aggregated = useAggregatedData({
    layerId:     config.layerId,
    xField:      config.xField,
    yField:      config.yField,
    aggregation: config.aggregation ?? 'sum',
  })

  const data = aggregated.length > 0
    ? aggregated.map(item => [Number(item.x) || 0, item.y])
    : [
      [10,8],[20,15],[30,22],[40,35],[50,42],
      [60,55],[70,61],[80,72],[15,12],[45,38],
      [55,49],[65,58],
    ]
 
  const option = {
    grid: { top: 16, right: 16, bottom: 32, left: 40 },
    xAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: { color: '#9ca3af', fontSize: 11 },
      splitLine: { lineStyle: { color: '#f3f4f6' } },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { lineStyle: { color: '#f3f4f6' } },
      axisLabel: { color: '#9ca3af', fontSize: 11 },
    },
    series: [
      {
        type: 'scatter',
        data,
        itemStyle: { color, opacity },
        symbolSize: size,
      },
      ...(config.showRegressionLine ? [{
        type: 'line',
        data: [[10, 5], [80, 75]],
        lineStyle: { color: '#ef4444', type: 'dashed', width: 1.5 },
        symbol: 'none',
        tooltip: { show: false },
      }] : []),
    ],
    tooltip: { trigger: 'item' },
  }
 
  return <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
}
 
export default ScatterChart