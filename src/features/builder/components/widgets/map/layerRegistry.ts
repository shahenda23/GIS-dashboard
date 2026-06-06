// import type { GeoLayer } from '../../../../types/builder.types'
// import type { LayerHandler } from './LayerHandler'
// import { GeoJsonHandler } from './handlers/GeoJsonHandler'
// import { HeatmapHandler } from './handlers/HeatmapHandler'
// import { WmsHandler } from './handlers/WmsHandler'
// import { RasterHandler } from './handlers/RasterHandler'
// import { VectorTileHandler } from './handlers/VectorTileHandler'

// const handlers: LayerHandler[] = [
//   new HeatmapHandler(),
//   new WmsHandler(),
//   new RasterHandler(),
//   new VectorTileHandler(),
//   new GeoJsonHandler(), // fallback — handles geojson, csv, kml, gpx, shapefile
// ]

// export function getLayerHandler(type: GeoLayer['type']): LayerHandler {
//   return handlers.find(h => h.canHandle(type)) ?? handlers[handlers.length - 1]
// }
import type { GeoLayer } from '../../../types/builder.types'
import type { LayerHandler } from './LayerHandler'
import { GeoJsonHandler } from './handlers/GeoJsonHandler'
import { HeatmapHandler } from './handlers/HeatmapHandler'
import { WmsHandler } from './handlers/WmsHandler'
import { RasterHandler } from './handlers/RasterHandler'
import { VectorTileHandler } from './handlers/VectorTileHandler'

const handlers: LayerHandler[] = [
  new HeatmapHandler(),
  new WmsHandler(),
  new RasterHandler(),
  new VectorTileHandler(),
  new GeoJsonHandler(), // fallback — handles geojson, csv, kml, gpx, shapefile
]

export function getLayerHandler(type: GeoLayer['type']): LayerHandler {
  return handlers.find(h => h.canHandle(type)) ?? handlers[handlers.length - 1]
}