import { WidgetType } from '../../types/builder.types'
import BarChart from './charts/BarChart'
import LineChart from './charts/LineChart'
import PieChart from './charts/PieChart'
import DonutChart from './charts/DonutChart'
import AreaChart from './charts/AreaChart'
import ScatterChart from './charts/ScatterChart'

interface ChartWidgetProps {
  type: WidgetType
  config: any
}

function ChartWidget({ type, config }: ChartWidgetProps) {
  switch (type) {
    case 'bar-chart':     return <BarChart config={config} />
    case 'line-chart':    return <LineChart config={config} />
    case 'pie-chart':     return <PieChart config={config} />
    case 'donut-chart':   return <DonutChart config={config} />
    case 'area-chart':    return <AreaChart config={config} />
    case 'scatter-chart': return <ScatterChart config={config} />
    default:              return null
  }
}

export default ChartWidget