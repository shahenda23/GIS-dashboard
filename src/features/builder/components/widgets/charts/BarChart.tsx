import ReactECharts from 'echarts-for-react'
import { BarChartConfig } from '../../../types/builder.types'
import { useAggregatedData } from '../../../hooks/useAggregatedData'

interface BarChartProps {
  config?: Partial<BarChartConfig>
}

function BarChart({ config = {} }: BarChartProps) {
  const color     = config.color         ?? '#0ea5e9'
  const radius    = config.barRadius     ?? 4
  const gridLines = config.showGridLines !== false
  const labelSize = config.labelSize     ?? 11

  const aggregated = useAggregatedData({
    layerId:     config.layerId,
    xField:      config.xField,
    yField:      config.yField,
    aggregation: config.aggregation ?? 'sum',
  })

  const hasRealData =
    aggregated.length > 0 &&
    !!config.xField &&
    !!config.yField

  const sorted = [...aggregated]
  if (config.sortOrder === 'asc')  sorted.sort((a, b) => a.y - b.y)
  if (config.sortOrder === 'desc') sorted.sort((a, b) => b.y - a.y)

  const xData = hasRealData
    ? sorted.map(item => item.x)
    : ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E']

  const yData = hasRealData
    ? sorted.map(item => item.y)
    : [120, 200, 150, 80, 170]

  const avg = yData.length ? yData.reduce((a, b) => a + b, 0) / yData.length : 0

  const option = {
    legend: { show: false },

    grid: { top: 22, right: 24, bottom: 32, left: 40 },

    xAxis: {
      type: 'category',
      data: xData,
      axisLine: { lineStyle: { color: '#e5e7eb' } },
      axisLabel: {
        color: '#9ca3af',
        fontSize: labelSize,
        rotate: xData.some(x => x.length > 8) ? 30 : 0,
        overflow: 'truncate',
        width: 80,
      },
    },

    yAxis: {
      type: 'value',
      axisLine: { show: false },
      splitLine: { show: gridLines, lineStyle: { color: '#f3f4f6' } },
      axisLabel: { color: '#9ca3af', fontSize: labelSize },
    },

    series: [
      {
        type: 'bar',
        data: yData,
        itemStyle: {
          color,
          borderRadius: [radius, radius, 0, 0],
        },
        barMaxWidth: 48,
        label: config.showMaxLabel
          ? {
              show: true,
              position: 'top',
              fontSize: 10,
              color: '#6b7280',
              formatter: (params: any) =>
                params.value === Math.max(...yData) ? `${params.value}` : '',
            }
          : { show: false },
        markLine: config.showAverage
          ? {
              silent: true,
              symbol: 'none',
              data: [{ yAxis: Math.round(avg * 10) / 10 }],
              lineStyle: { color: '#ef4444', type: 'dashed', width: 1.5 },
              label: {
                show: true,
                position: 'insideMiddleTop',
                formatter: `Avg: ${Math.round(avg)}`,
                fontSize: 10,
                color: '#ef4444',
              },
            }
          : { show: false },
      },
    ],

    tooltip: {
      trigger: 'axis',
      formatter: (params: any[]) => {
        const bar = params.find(p => p.seriesType === 'bar')
        if (!bar) return ''
        return `
          <div style="font-size:12px">
            <b>${bar.name}</b><br/>
            ${config.yField ?? 'Value'}: <b>${bar.value}</b>
          </div>
        `
      },
    },
  }

  const legendItems = config.showLegend
    ? [
        { type: 'square', color, label: config.xField ?? 'Value' },
        ...(config.showAverage
          ? [{ type: 'dashed' as const, color: '#ef4444', label: 'Average' }]
          : []),
      ]
    : []

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' , justifyContent: 'center' }}>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          notMerge
        />
      </div>

      {/* Legend */}
      {legendItems.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          padding: '6px 8px',
          flexShrink: 0,
        }}>
          {legendItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {item.type === 'square' ? (
                <span style={{
                  width: '10px', height: '10px',
                  borderRadius: '2px',
                  background: item.color,
                  flexShrink: 0,
                }} />
              ) : (
                <span style={{
                  width: '16px', height: '2px',
                  borderTop: `2px dashed ${item.color}`,
                  flexShrink: 0,
                }} />
              )}
              <span style={{ fontSize: '11px', color: '#6b7280' }}>{item.label}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default BarChart
