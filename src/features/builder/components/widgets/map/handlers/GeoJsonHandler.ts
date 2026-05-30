import type { MutableRefObject } from 'react'
import maplibregl from 'maplibre-gl'
import type { GeoLayer, MapConfig } from '../../../../../types/builder.types'
import type { LayerHandler } from '../LayerHandler'

export function getGeometryType(data: any): string {
  const features = data?.features ?? []
  if (!features.length) return 'unknown'
  return features[0]?.geometry?.type ?? 'unknown'
}

function addPopup(
  map: maplibregl.Map,
  layerId: string,
  showPopupRef: MutableRefObject<boolean>,
  getConfig: () => Partial<MapConfig>
) {
  const layerName = `${layerId}-layer`
  const popup = new maplibregl.Popup({
    closeButton: true,
    closeOnClick: false,
    maxWidth: '300px',
    className: 'gis-popup',
  })

  map.on('mouseenter', layerName, () => {
    if (!showPopupRef.current) return
    map.getCanvas().style.cursor = 'pointer'
  })

  map.on('mouseleave', layerName, () => {
    map.getCanvas().style.cursor = ''
  })

  map.on('click', layerName, (e) => {
    if (!showPopupRef.current) return
    if (!e.features?.length) return

    const cfg   = getConfig()
    const props = e.features[0].properties ?? {}

    const fields = cfg.popupFields?.length
      ? cfg.popupFields
          .filter(pf => pf.visible && props[pf.field] != null && props[pf.field] !== '')
          .map(pf => ({ label: pf.alias, value: props[pf.field] }))
      : Object.entries(props)
          .filter(([, v]) => v != null && v !== '')
          .map(([k, v]) => ({ label: k, value: v }))

    const title = cfg.popupTitleField && props[cfg.popupTitleField] != null
      ? String(props[cfg.popupTitleField])
      : 'Feature Properties'

    const rows = fields
      .map(({ label, value }) => `
        <tr>
          <td style="padding:3px 8px 3px 0;color:#6b7280;font-size:11px;font-weight:600;white-space:nowrap;">${label}</td>
          <td style="padding:3px 0;color:#111827;font-size:11px;">${value}</td>
        </tr>
      `)
      .join('')

    popup
      .setLngLat(e.lngLat)
      .setHTML(`
        <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;padding:4px 2px;">
          <p style="font-size:11px;font-weight:700;color:#0ea5e9;margin:0 0 8px 0;padding-bottom:6px;border-bottom:1px solid #e5e7eb;text-transform:uppercase;letter-spacing:0.5px;">
            ${title}
          </p>
          ${rows
            ? `<table style="border-collapse:collapse;width:100%">${rows}</table>`
            : '<p style="color:#9ca3af;font-size:11px;margin:0">No properties</p>'
          }
        </div>
      `)
      .addTo(map)
  })
}

export class GeoJsonHandler implements LayerHandler {
  canHandle(type: GeoLayer['type']) {
    return ['geojson', 'csv', 'kml', 'gpx', 'shapefile'].includes(type)
  }

  add(
    map: maplibregl.Map,
    layer: GeoLayer,
    showPopupRef: MutableRefObject<boolean>,
    getConfig: () => Partial<MapConfig>
  ) {
    this.remove(map, layer.id)

    try {
      map.addSource(layer.id, { type: 'geojson', data: layer.data })
    } catch (err) {
      console.warn(`addSource failed for ${layer.id}:`, err)
      return
    }

    const geoType = getGeometryType(layer.data)

    try {
      if (geoType === 'Point' || geoType === 'MultiPoint') {
        map.addLayer({
          id: `${layer.id}-layer`,
          type: 'circle',
          source: layer.id,
          paint: {
            'circle-radius': 6,
            'circle-color': layer.color,
            'circle-opacity': 0.85,
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#ffffff',
          },
        })
      } else if (geoType === 'Polygon' || geoType === 'MultiPolygon') {
        map.addLayer({
          id: `${layer.id}-layer`,
          type: 'fill',
          source: layer.id,
          paint: { 'fill-color': layer.color, 'fill-opacity': 0.4 },
        })
        map.addLayer({
          id: `${layer.id}-outline`,
          type: 'line',
          source: layer.id,
          paint: { 'line-color': layer.color, 'line-width': 1.5 },
        })
      } else {
        map.addLayer({
          id: `${layer.id}-layer`,
          type: 'line',
          source: layer.id,
          paint: { 'line-color': layer.color, 'line-width': 2.5, 'line-opacity': 0.9 },
        })
      }

      addPopup(map, layer.id, showPopupRef, getConfig)
    } catch (err) {
      console.warn(`addLayer failed for ${layer.id}:`, err)
    }
  }

  remove(map: maplibregl.Map, layerId: string) {
    const layerName = `${layerId}-layer`  // ← متعرف هنا صح

    // remove event listeners first
    try { map.off('click',      layerName, () => {}) } catch {}
    try { map.off('mouseenter', layerName, () => {}) } catch {}
    try { map.off('mouseleave', layerName, () => {}) } catch {}

    // remove layers then source
    try { if (map.getLayer(`${layerId}-outline`)) map.removeLayer(`${layerId}-outline`) } catch {}
    try { if (map.getLayer(layerName))            map.removeLayer(layerName)            } catch {}
    try { if (map.getSource(layerId))             map.removeSource(layerId)             } catch {}
  }

  setVisibility(map: maplibregl.Map, layerId: string, visible: boolean) {
    const v = visible ? 'visible' : 'none'
    try { if (map.getLayer(`${layerId}-layer`))   map.setLayoutProperty(`${layerId}-layer`,   'visibility', v) } catch {}
    try { if (map.getLayer(`${layerId}-outline`)) map.setLayoutProperty(`${layerId}-outline`, 'visibility', v) } catch {}
  }

  updateStyle(map: maplibregl.Map, layer: GeoLayer) {
    if (!layer.visible) return
    const geoType = getGeometryType(layer.data)
    try {
      if (geoType === 'Point' || geoType === 'MultiPoint') {
        map.setPaintProperty(`${layer.id}-layer`, 'circle-color', layer.color)
      } else if (geoType === 'Polygon' || geoType === 'MultiPolygon') {
        map.setPaintProperty(`${layer.id}-layer`, 'fill-color',  layer.color)
        if (map.getLayer(`${layer.id}-outline`))
          map.setPaintProperty(`${layer.id}-outline`, 'line-color', layer.color)
      } else {
        map.setPaintProperty(`${layer.id}-layer`, 'line-color', layer.color)
      }
    } catch {}
  }
}