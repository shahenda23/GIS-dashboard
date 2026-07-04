
// import mapboxgl from 'mapbox-gl'
// import type { GeoLayer, MapConfig } from '../../../../types/builder.types'
// import type { LayerHandler } from '../LayerHandler'
// import type { MutableRefObject } from 'react'

// export class WmsHandler implements LayerHandler {
//   canHandle(type: GeoLayer['type']) {
//     return type === 'wms'
//   }

//   add(
//     map: mapboxgl.Map,
//     layer: GeoLayer,
//     _showPopupRef: MutableRefObject<boolean>,
//     _getConfig: () => Partial<MapConfig>
//   ) {
//     const url = (layer as any).url
//     if (!url) {
//       console.warn(`WmsHandler: layer "${layer.id}" has no url`)
//       return
//     }

//     this.remove(map, layer.id)

//     try {
//       map.addSource(layer.id, {
//         type: 'raster',
//         tiles: [url],
//         tileSize: 256,
//       })
//       map.addLayer({
//         id: `${layer.id}-layer`,
//         type: 'raster',
//         source: layer.id,
//         paint: { 'raster-opacity': 0.85 },
//       })
//     } catch (err) {
//       console.warn(`WmsHandler: failed for ${layer.id}:`, err)
//     }
//   }

//   remove(map: mapboxgl.Map, layerId: string) {
//     try { if (map.getLayer(`${layerId}-layer`)) map.removeLayer(`${layerId}-layer`) } catch {}
//     try { if (map.getSource(layerId))           map.removeSource(layerId)           } catch {}
//   }

//   setVisibility(map: mapboxgl.Map, layerId: string, visible: boolean) {
//     try {
//       if (map.getLayer(`${layerId}-layer`))
//         map.setLayoutProperty(`${layerId}-layer`, 'visibility', visible ? 'visible' : 'none')
//     } catch {}
//   }

//   updateStyle(_map: mapboxgl.Map, _layer: GeoLayer) {
//     // WMS tiles don't support color overrides
//   }
// }




// import type maplibregl from 'maplibre-gl'
// import type { GeoLayer, MapConfig } from '../../../../../types/builder.types'
// import type { LayerHandler } from '../LayerHandler'
// import type { MutableRefObject } from 'react'

// export class WmsHandler implements LayerHandler {
//   canHandle(type: GeoLayer['type']) {
//     return type === 'wms'
//   }

//   add(
//     map: maplibregl.Map,
//     layer: GeoLayer,
//     _showPopupRef: MutableRefObject<boolean>,
//     _getConfig: () => Partial<MapConfig>
//   ) {
//     const url = (layer as any).url
//     if (!url) {
//       console.warn(`WmsHandler: layer "${layer.id}" has no url`)
//       return
//     }

//     this.remove(map, layer.id)

//     try {
//       map.addSource(layer.id, {
//         type: 'raster',
//         tiles: [url],
//         tileSize: 256,
//       })
//       map.addLayer({
//         id: `${layer.id}-layer`,
//         type: 'raster',
//         source: layer.id,
//         paint: { 'raster-opacity': 0.85 },
//       })
//     } catch (err) {
//       console.warn(`WmsHandler: failed for ${layer.id}:`, err)
//     }
//   }

//   remove(map: maplibregl.Map, layerId: string) {
//     try { if (map.getLayer(`${layerId}-layer`)) map.removeLayer(`${layerId}-layer`) } catch {}
//     try { if (map.getSource(layerId))           map.removeSource(layerId)           } catch {}
//   }

//   setVisibility(map: maplibregl.Map, layerId: string, visible: boolean) {
//     try {
//       if (map.getLayer(`${layerId}-layer`))
//         map.setLayoutProperty(`${layerId}-layer`, 'visibility', visible ? 'visible' : 'none')
//     } catch {}
//   }

//   updateStyle(map: maplibregl.Map, layer: GeoLayer) {
//     // WMS tiles don't support color overrides
//   }
// }
import maplibregl from 'mapbox-gl'
import type { GeoLayer, MapConfig } from '../../../../types/builder.types'
import type { LayerHandler } from '../LayerHandler'
import type { MutableRefObject } from 'react'

export class WmsHandler implements LayerHandler {
  canHandle(type: GeoLayer['type']) {
    return type === 'wms'
  }

  add(
    map: maplibregl.Map,
    layer: GeoLayer,
    _showPopupRef: MutableRefObject<boolean>,
    _getConfig: () => Partial<MapConfig>
  ) {
    const url = (layer as any).url
    if (!url) {
      console.warn(`WmsHandler: layer "${layer.id}" has no url`)
      return
    }

    this.remove(map, layer.id)

    try {
      map.addSource(layer.id, {
        type: 'raster',
        tiles: [url],
        tileSize: 256,
      })
      map.addLayer({
        id: `${layer.id}-layer`,
        type: 'raster',
        source: layer.id,
        paint: { 'raster-opacity': 0.85 },
      })
    } catch (err) {
      console.warn(`WmsHandler: failed for ${layer.id}:`, err)
    }
  }

  remove(map: maplibregl.Map, layerId: string) {
    try { if (map.getLayer(`${layerId}-layer`)) map.removeLayer(`${layerId}-layer`) } catch {}
    try { if (map.getSource(layerId))           map.removeSource(layerId)           } catch {}
  }

  setVisibility(map: maplibregl.Map, layerId: string, visible: boolean) {
    try {
      if (map.getLayer(`${layerId}-layer`))
        map.setLayoutProperty(`${layerId}-layer`, 'visibility', visible ? 'visible' : 'none')
    } catch {}
  }

  updateStyle(_map: maplibregl.Map, _layer: GeoLayer) {
    // WMS tiles don't support color overrides
  }
}