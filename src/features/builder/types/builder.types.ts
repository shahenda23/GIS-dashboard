export type WidgetType =
  | 'map'
  | 'bar-chart'
  | 'line-chart'
  | 'pie-chart'
  | 'donut-chart'
  | 'area-chart'
  | 'scatter-chart'
  | 'table'
  | 'kpi'
  | 'filter'

export interface Widget {
  id: string
  type: WidgetType
  title: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
}

export interface GeoLayer {
  id: string
  name: string
  type: 'geojson' | 'wms' | 'csv' | 'kml' | 'gpx' | 'shapefile' | 'vector-tile' | 'raster' | 'heatmap' 
  visible: boolean
  color: string
  data?: any  // GeoJSON data
  fields?: string[]  // ← اضيفي دي
}

export interface BuilderState {
  widgets: Widget[]
  layers: GeoLayer[]
  selectedWidgetId: string | null
  dashboardTitle: string
  dashboardId: string
  isSaved: boolean
  zoomToLayerId: string | null
}

export type AggregationType = 'sum' | 'avg' | 'min' | 'max' | 'count'

export interface DashboardConfig {
  id: string
  title: string
  widgets: Widget[]
  layers: GeoLayer[]
  createdAt: string
  updatedAt: string
  thumbnail: string
}

export interface BarChartConfig {
  layerId: string
  xField: string
  yField: string
  aggregation: AggregationType 
  color: string
  barRadius: number
  showGridLines: boolean
  showLegend: boolean
  labelSize: number
  sortOrder: 'none' | 'asc' | 'desc'
  showAverage: boolean
  showMaxLabel: boolean
}

export interface LineChartConfig {
  layerId: string
  xField: string
  yField: string
  aggregation: AggregationType
  color: string
  lineThickness: number
  smooth: boolean
  showDots: boolean
  showArea: boolean
  areaOpacity: number
  showTrendLine: boolean
  showMinMax: boolean
  showAverage: boolean
}

export interface PieChartConfig {
  layerId: string
  categoryField: string
  valueField: string
  aggregation?: AggregationType
  showLabels: boolean
  labelType: 'value' | 'percent' | 'name'
  showLegend: boolean
  highlightLargest: boolean
}

export interface DonutChartConfig extends PieChartConfig {
  holeSize: number
  showTotal: boolean
}

export interface AreaChartConfig extends LineChartConfig {
  fillOpacity: number
}

export interface ScatterChartConfig {
  layerId: string
  xField: string
  yField: string
  aggregation: AggregationType
  color: string
  pointSize: number
  pointOpacity: number
  showRegressionLine: boolean
  showCorrelation: boolean
  showQuadrants: boolean
}

export interface PopupFieldConfig {
  field: string    // real field name from GeoJSON properties
  alias: string    // what the user wants to display as label
  visible: boolean // show or hide this field
}

export interface MapConfig {
  layerId: string
  mapStyle: string
  zoom: number
  showNavigation: boolean
  showScale: boolean
  allowZoom: boolean
  allowPan: boolean
  showLegend: boolean
  showPopup: boolean
  showBasemapGallery: boolean
  popupTitleField?: string
  popupFields?: PopupFieldConfig[]
}

export interface KPIConfig {
  layerId: string
  valueField: string
  calculation: 'sum' | 'count' | 'average' | 'max' | 'min'
  label: string
  unit: string
  compareField: string
  fontSize: number
  showTrendArrow: boolean
}

export interface TableConfig {
  layerId: string
  maxRows: number
  selectedFields: string[]
  rowHeight: 'compact' | 'normal' | 'comfortable'
  showRowNumbers: boolean
  stripeRows: boolean
  allowSorting: boolean
  allowSearch: boolean
  fontSize: number
}

export interface FilterConfig {
  layerId: string
  filterField: string
  filterType: 'checkbox' | 'dropdown' | 'range' | 'date'
  label: string
  allowMultiple: boolean
  affectsWidgets: string[]
}

export type WidgetConfig =
  | BarChartConfig
  | LineChartConfig
  | PieChartConfig
  | DonutChartConfig
  | AreaChartConfig
  | ScatterChartConfig
  | MapConfig
  | KPIConfig
  | TableConfig
  | FilterConfig

// عدلي الـ Widget interface
export interface Widget {
  id: string
  type: WidgetType
  title: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  config: Partial<WidgetConfig>
}