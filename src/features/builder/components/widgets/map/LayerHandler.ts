// import type { MutableRefObject } from 'react'
// import type maplibregl from 'maplibre-gl'
// import type { GeoLayer, MapConfig } from '../../../../types/builder.types'

// export interface LayerHandler {
//   canHandle(type: GeoLayer['type']): boolean

//   add(
//     map: maplibregl.Map,
//     layer: GeoLayer,
//     showPopupRef: MutableRefObject<boolean>,
//     getConfig: () => Partial<MapConfig>
//   ): void

//   remove(map: maplibregl.Map, layerId: string): void
//   setVisibility(map: maplibregl.Map, layerId: string, visible: boolean): void
//   updateStyle(map: maplibregl.Map, layer: GeoLayer): void
// }
import type { MutableRefObject } from 'react'
import type mapboxgl from 'mapbox-gl'
import type { GeoLayer, MapConfig } from '../../../types/builder.types'

export interface LayerHandler {
  canHandle(type: GeoLayer['type']): boolean

  add(
    map: mapboxgl.Map,
    layer: GeoLayer,
    showPopupRef: MutableRefObject<boolean>,
    getConfig: () => Partial<MapConfig>
  ): void

  remove(map: mapboxgl.Map, layerId: string): void
  setVisibility(map: mapboxgl.Map, layerId: string, visible: boolean): void
  updateStyle(map: mapboxgl.Map, layer: GeoLayer): void
}