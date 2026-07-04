
// import mapboxgl from 'mapbox-gl'
// import type { GeoLayer, MapConfig } from '../../../../types/builder.types'
// import type { LayerHandler } from '../LayerHandler'
// import type { MutableRefObject } from 'react'

// export class VectorTileHandler implements LayerHandler {
//   canHandle(type: GeoLayer['type']) {
//     return type === 'vector-tile'
//   }

//   add(
//     map: mapboxgl.Map,
//     layer: GeoLayer,
//     _showPopupRef: MutableRefObject<boolean>,
//     _getConfig: () => Partial<MapConfig>
//   ) {
//     const url = (layer as any).url
//     if (!url) {
//       console.warn(`VectorTileHandler: layer "${layer.id}" has no url`)
//       return
//     }

//     this.remove(map, layer.id)

//     try {
//       map.addSource(layer.id, { type: 'vector', url })
//       map.addLayer({
//         id: `${layer.id}-layer`,
//         type: 'fill',
//         source: layer.id,
//         'source-layer': (layer as any).sourceLayer ?? layer.id,
//         paint: { 'fill-color': layer.color, 'fill-opacity': 0.5 },
//       })
//     } catch (err) {
//       console.warn(`VectorTileHandler: failed for ${layer.id}:`, err)
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

//   updateStyle(map: mapboxgl.Map, layer: GeoLayer) {
//     try {
//       map.setPaintProperty(`${layer.id}-layer`, 'fill-color', layer.color)
//     } catch {}
//   }
// }






// import type maplibregl from 'maplibre-gl'
// import type { GeoLayer, MapConfig } from '../../../../../types/builder.types'
// import type { LayerHandler } from '../LayerHandler'
// import type { MutableRefObject } from 'react'

// export class VectorTileHandler implements LayerHandler {
//   canHandle(type: GeoLayer['type']) {
//     return type === 'vector-tile'
//   }

//   add(
//     map: maplibregl.Map,
//     layer: GeoLayer,
//     _showPopupRef: MutableRefObject<boolean>,
//     _getConfig: () => Partial<MapConfig>
//   ) {
//     const url = (layer as any).url
//     if (!url) {
//       console.warn(`VectorTileHandler: layer "${layer.id}" has no url`)
//       return
//     }

//     this.remove(map, layer.id)

//     try {
//       map.addSource(layer.id, { type: 'vector', url })
//       map.addLayer({
//         id: `${layer.id}-layer`,
//         type: 'fill',
//         source: layer.id,
//         'source-layer': (layer as any).sourceLayer ?? layer.id,
//         paint: { 'fill-color': layer.color, 'fill-opacity': 0.5 },
//       })
//     } catch (err) {
//       console.warn(`VectorTileHandler: failed for ${layer.id}:`, err)
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
//     try {
//       map.setPaintProperty(`${layer.id}-layer`, 'fill-color', layer.color)
//     } catch {}
//   }
// }
import maplibregl from 'mapbox-gl'
import type { GeoLayer, MapConfig } from '../../../../types/builder.types'
import type { LayerHandler } from '../LayerHandler'
import type { MutableRefObject } from 'react'

export class VectorTileHandler implements LayerHandler {
  canHandle(type: GeoLayer['type']) {
    return type === 'vector-tile'
  }

  add(
    map: maplibregl.Map,
    layer: GeoLayer,
    _showPopupRef: MutableRefObject<boolean>,
    _getConfig: () => Partial<MapConfig>
  ) {
    const url = (layer as any).url
    if (!url) {
      console.warn(`VectorTileHandler: layer "${layer.id}" has no url`)
      return
    }

    this.remove(map, layer.id)

    try {
      map.addSource(layer.id, { type: 'vector', url })
      map.addLayer({
        id: `${layer.id}-layer`,
        type: 'fill',
        source: layer.id,
        'source-layer': (layer as any).sourceLayer ?? layer.id,
        paint: { 'fill-color': layer.color, 'fill-opacity': 0.5 },
      })
    } catch (err) {
      console.warn(`VectorTileHandler: failed for ${layer.id}:`, err)
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

  updateStyle(map: maplibregl.Map, layer: GeoLayer) {
    try {
      map.setPaintProperty(`${layer.id}-layer`, 'fill-color', layer.color)
    } catch {}
  }
}