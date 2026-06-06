// import maplibregl from 'maplibre-gl'
// import type { GeoLayer, MapConfig } from '../../../../../types/builder.types'
// import type { LayerHandler } from '../LayerHandler'
// import type { MutableRefObject } from 'react'

// export class HeatmapHandler implements LayerHandler {
//   canHandle(type: GeoLayer['type']) {
//     return type === 'heatmap'
//   }

//   add(
//     map: maplibregl.Map,
//     layer: GeoLayer,
//     _showPopupRef: MutableRefObject<boolean>,
//     _getConfig: () => Partial<MapConfig>
//   ) {
//     this.remove(map, layer.id)

//     try {
//       map.addSource(layer.id, { type: 'geojson', data: layer.data })
//     } catch (err) {
//       console.warn(`HeatmapHandler: addSource failed for ${layer.id}:`, err)
//       return
//     }

//     try {
//       map.addLayer({
//         id: `${layer.id}-layer`,
//         type: 'heatmap',
//         source: layer.id,
//         paint: {
//           'heatmap-radius': 25,
//           'heatmap-opacity': 0.85,
//           'heatmap-intensity': 1,
//           'heatmap-color': [
//             'interpolate', ['linear'], ['heatmap-density'],
//             0,   'rgba(0,0,255,0)',
//             0.2, 'rgba(0,255,255,0.5)',
//             0.5, 'rgba(0,255,0,0.7)',
//             0.8, 'rgba(255,255,0,0.9)',
//             1,   layer.color,
//           ],
//         },
//       })
//     } catch (err) {
//       console.warn(`HeatmapHandler: addLayer failed for ${layer.id}:`, err)
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
//       map.setPaintProperty(`${layer.id}-layer`, 'heatmap-color', [
//         'interpolate', ['linear'], ['heatmap-density'],
//         0,   'rgba(0,0,255,0)',
//         0.2, 'rgba(0,255,255,0.5)',
//         0.5, 'rgba(0,255,0,0.7)',
//         0.8, 'rgba(255,255,0,0.9)',
//         1,   layer.color,
//       ])
//     } catch {}
//   }
// }
import mapboxgl from 'mapbox-gl'
import type { GeoLayer, MapConfig } from '../../../../types/builder.types'
import type { LayerHandler } from '../LayerHandler'
import type { MutableRefObject } from 'react'

export class HeatmapHandler implements LayerHandler {
  canHandle(type: GeoLayer['type']) {
    return type === 'heatmap'
  }

  add(
    map: mapboxgl.Map,
    layer: GeoLayer,
    _showPopupRef: MutableRefObject<boolean>,
    _getConfig: () => Partial<MapConfig>
  ) {
    this.remove(map, layer.id)

    try {
      map.addSource(layer.id, { type: 'geojson', data: layer.data })
    } catch (err) {
      console.warn(`HeatmapHandler: addSource failed for ${layer.id}:`, err)
      return
    }

    try {
      map.addLayer({
        id: `${layer.id}-layer`,
        type: 'heatmap',
        source: layer.id,
        paint: {
          'heatmap-radius': 25,
          'heatmap-opacity': 0.85,
          'heatmap-intensity': 1,
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0,   'rgba(0,0,255,0)',
            0.2, 'rgba(0,255,255,0.5)',
            0.5, 'rgba(0,255,0,0.7)',
            0.8, 'rgba(255,255,0,0.9)',
            1,   layer.color,
          ],
        },
      })
    } catch (err) {
      console.warn(`HeatmapHandler: addLayer failed for ${layer.id}:`, err)
    }
  }

  remove(map: mapboxgl.Map, layerId: string) {
    try { if (map.getLayer(`${layerId}-layer`)) map.removeLayer(`${layerId}-layer`) } catch {}
    try { if (map.getSource(layerId))           map.removeSource(layerId)           } catch {}
  }

  setVisibility(map: mapboxgl.Map, layerId: string, visible: boolean) {
    try {
      if (map.getLayer(`${layerId}-layer`))
        map.setLayoutProperty(`${layerId}-layer`, 'visibility', visible ? 'visible' : 'none')
    } catch {}
  }

  updateStyle(map: mapboxgl.Map, layer: GeoLayer) {
    try {
      map.setPaintProperty(`${layer.id}-layer`, 'heatmap-color', [
        'interpolate', ['linear'], ['heatmap-density'],
        0,   'rgba(0,0,255,0)',
        0.2, 'rgba(0,255,255,0.5)',
        0.5, 'rgba(0,255,0,0.7)',
        0.8, 'rgba(255,255,0,0.9)',
        1,   layer.color,
      ])
    } catch {}
  }
}