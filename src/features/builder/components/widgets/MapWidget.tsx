import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MapConfig } from '../../types/builder.types'
import { useBuilderStore } from '../../store/builderStore'
import { getLayerHandler } from './map/layerRegistry'
import { getGeometryType } from './map/handlers/GeoJsonHandler'

interface MapWidgetProps {
  widgetId: string
  config: Partial<MapConfig>
}

export const MAP_STYLES = [
  { value: 'https://tiles.openfreemap.org/styles/liberty',  label: 'Liberty' },
  { value: 'https://tiles.openfreemap.org/styles/bright',   label: 'Bright' },
  { value: 'https://tiles.openfreemap.org/styles/positron', label: 'Positron' },
  { value: 'https://tiles.openfreemap.org/styles/fiord',    label: 'Fiord (Dark)' },
]

// ── BBox from GeoJSON ─────────────────────────────────────────────────────────
function getBBox(data: any): [[number, number], [number, number]] | null {
  const coords: [number, number][] = []

  function collect(geom: any) {
    if (!geom) return
    switch (geom.type) {
      case 'Point':           coords.push(geom.coordinates); break
      case 'MultiPoint':
      case 'LineString':      coords.push(...geom.coordinates); break
      case 'MultiLineString':
      case 'Polygon':         geom.coordinates.forEach((r: any) => coords.push(...r)); break
      case 'MultiPolygon':    geom.coordinates.forEach((p: any) => p.forEach((r: any) => coords.push(...r))); break
    }
  }

  ;(data?.features ?? []).forEach((f: any) => collect(f.geometry))
  if (!coords.length) return null

  const lngs = coords.map(c => c[0])
  const lats  = coords.map(c => c[1])
  return [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]]
}

// ── Legend ────────────────────────────────────────────────────────────────────
function createLegend(map: maplibregl.Map, storeLayers: any[], showLegend = true) {
  const container = map.getContainer()
  const existingRoot = container.querySelector('#map-legend-root')
  if (existingRoot) existingRoot.remove()

  if (!showLegend) return

  const visibleLayers = storeLayers.filter(l => l.visible && l.data)
  if (!visibleLayers.length) return

  const root = document.createElement('div')
  root.id = 'map-legend-root'
  root.style.cssText = `
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    z-index: 10;
    pointer-events: auto;
  `

  const toggle = document.createElement('button')
  toggle.type = 'button'
  toggle.title = 'Show legend'
  toggle.style.cssText = `
    width: 34px; height: 34px;
    border: 1px solid #d1d5db; border-radius: 12px;
    background: rgba(255,255,255,0.95); color: #111827;
    display: inline-flex; align-items: center; justify-content: center;
    cursor: pointer; box-shadow: 0 1px 4px rgba(0,0,0,0.08); padding: 0;
  `
  toggle.innerHTML = '<span style="font-size:16px;line-height:1;">☰</span>'

  const legend = document.createElement('div')
  legend.id = 'map-legend'
  legend.style.cssText = `
    width: 240px;
    max-height: ${Math.floor(container.offsetHeight * 0.5)}px;
    overflow-y: auto;
    background: rgba(255,255,255,0.98);
    border: 1px solid #e5e7eb; border-radius: 14px;
    padding: 12px 14px;
    box-shadow: 0 3px 12px rgba(0,0,0,0.12);
    color: #111827; display: none; pointer-events: auto;
  `

  const title = document.createElement('p')
  title.textContent = 'Layers'
  title.style.cssText = `
    font-size: 10px; font-weight: 700; color: #6b7280;
    text-transform: uppercase; letter-spacing: 0.8px;
    margin: 0 0 8px 0; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb;
  `
  legend.appendChild(title)

  visibleLayers.forEach(layer => {
    const geoType = getGeometryType(layer.data)
    const item = document.createElement('div')
    item.style.cssText = `
      display: flex; align-items: center; gap: 8px; margin-bottom: 6px;
      padding: 4px 6px; border-radius: 8px; cursor: default;
      transition: background 0.15s;
    `
    item.addEventListener('mouseenter', () => item.style.background = '#f3f4f6')
    item.addEventListener('mouseleave', () => { item.style.background = 'transparent'; zoomBtn.style.opacity = '0' })
    item.addEventListener('mouseenter', () => zoomBtn.style.opacity = '1')

    const icon = document.createElement('div')
    if (geoType === 'Point' || geoType === 'MultiPoint') {
      icon.style.cssText = `width:10px;height:10px;border-radius:50%;background:${layer.color};border:2px solid white;box-shadow:0 0 0 1px ${layer.color};flex-shrink:0;`
    } else if (geoType === 'Polygon' || geoType === 'MultiPolygon') {
      icon.style.cssText = `width:14px;height:10px;background:${layer.color}66;border:1.5px solid ${layer.color};border-radius:2px;flex-shrink:0;`
    } else {
      icon.style.cssText = `width:14px;height:3px;background:${layer.color};border-radius:2px;flex-shrink:0;`
    }

    const label = document.createElement('span')
    label.textContent = layer.name
    label.style.cssText = 'color:#374151;font-size:11px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0;'

    const zoomBtn = document.createElement('button')
    zoomBtn.title = 'Zoom to layer'
    zoomBtn.style.cssText = `
      flex-shrink: 0; opacity: 0; transition: opacity 0.15s;
      background: transparent; border: none; cursor: pointer;
      padding: 2px; display: flex; align-items: center; color: #6b7280;
    `
    zoomBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="5" cy="5" r="3.5"/>
      <line x1="7.5" y1="7.5" x2="11" y2="11"/>
      <line x1="5" y1="3.5" x2="5" y2="6.5"/>
      <line x1="3.5" y1="5" x2="6.5" y2="5"/>
    </svg>`
    zoomBtn.addEventListener('click', (e) => {
      e.stopPropagation()
      const bbox = getBBox(layer.data)
      if (bbox) map.fitBounds(bbox, { padding: 60, duration: 800, maxZoom: 18 })
    })

    item.appendChild(icon)
    item.appendChild(label)
    item.appendChild(zoomBtn)
    legend.appendChild(item)
  })

  toggle.addEventListener('click', () => {
    const isOpen = legend.style.display === 'block'
    legend.style.display = isOpen ? 'none' : 'block'
    toggle.title = isOpen ? 'Show legend' : 'Hide legend'
    toggle.innerHTML = isOpen
      ? '<span style="font-size:16px;line-height:1;">☰</span>'
      : '<span style="font-size:16px;line-height:1;">✕</span>'
  })

  root.appendChild(toggle)
  root.appendChild(legend)
  container.appendChild(root)
}

// ── Sync all layers via registry ──────────────────────────────────────────────
function syncLayers(
  map: maplibregl.Map,
  storeLayers: any[],
  prevLayerIds: React.MutableRefObject<Set<string>>,
  showLegend: boolean,
  showPopupRef: React.MutableRefObject<boolean>,
  getConfig: () => Partial<MapConfig>
) {
  const currentIds = new Set(storeLayers.map(l => l.id))

  // remove deleted layers
  prevLayerIds.current.forEach(id => {
    if (!currentIds.has(id)) {
      const deleted = storeLayers.find(l => l.id === id)
      const handler = getLayerHandler(deleted?.type ?? 'geojson')
      handler.remove(map, id)
    }
  })

  storeLayers.forEach(layer => {
    if (!layer.data && !((layer as any).url)) return

    const handler = getLayerHandler(layer.type)
    const exists  = !!map.getSource(layer.id)

    if (!exists) {
      handler.add(map, layer, showPopupRef, getConfig)
      if (!layer.visible) handler.setVisibility(map, layer.id, false)
    } else {
      handler.setVisibility(map, layer.id, layer.visible)
      if (layer.visible) handler.updateStyle(map, layer)
    }
  })

  prevLayerIds.current = currentIds
  createLegend(map, storeLayers, showLegend)
}

// ── Component ─────────────────────────────────────────────────────────────────
function MapWidget({ widgetId, config }: MapWidgetProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<maplibregl.Map | null>(null)
  const navRef       = useRef<maplibregl.NavigationControl | null>(null)
  const scaleRef     = useRef<maplibregl.ScaleControl | null>(null)
  const isLoaded     = useRef(false)
  const prevLayerIds = useRef<Set<string>>(new Set())
  const showLegendRef = useRef(config.showLegend !== false)
  const showPopupRef  = useRef(config.showPopup  !== false)
  const configRef     = useRef(config)

  const storeLayers   = useBuilderStore(s => s.layers)
  const zoomToLayerId = useBuilderStore(s => s.zoomToLayerId)

  // keep refs in sync every render
  showLegendRef.current = config.showLegend !== false
  showPopupRef.current  = config.showPopup  !== false
  configRef.current     = config

  const getConfig = () => configRef.current

  const mapStyle = config.mapStyle ?? MAP_STYLES[0].value
  const zoom     = config.zoom     ?? 10
  const center   = (config as any).center ?? [31.2357, 30.0444]

  // ── 1. Initialize map ─────────────────────────────────
  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center,
      zoom,
      attributionControl: false,
    })

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right')

    map.on('load', () => {
      isLoaded.current = true
      syncLayers(map, storeLayers, prevLayerIds, showLegendRef.current, showPopupRef, getConfig)
    })

    mapRef.current = map

    return () => {
      isLoaded.current = false
      prevLayerIds.current = new Set()
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── 2. Resize observer ────────────────────────────────
  useEffect(() => {
    if (!mapContainer.current) return
    const ro = new ResizeObserver(() => { mapRef.current?.resize() })
    ro.observe(mapContainer.current)
    return () => ro.disconnect()
  }, [])

  // ── 3. Style change ───────────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded.current) return
    map.setStyle(mapStyle)
    map.once('style.load', () => {
      prevLayerIds.current = new Set()
      syncLayers(map, storeLayers, prevLayerIds, showLegendRef.current, showPopupRef, getConfig)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStyle])

  // ── 4. Zoom level ─────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !isLoaded.current) return
    mapRef.current.setZoom(zoom)
  }, [zoom])

  // ── 5. Navigation control ─────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (navRef.current) { try { map.removeControl(navRef.current) } catch {} navRef.current = null }
    if (config.showNavigation !== false) {
      const nav = new maplibregl.NavigationControl()
      map.addControl(nav, 'top-right')
      navRef.current = nav
    }
  }, [config.showNavigation])

  // ── 6. Scale control ──────────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (scaleRef.current) { try { map.removeControl(scaleRef.current) } catch {} scaleRef.current = null }
    if (config.showScale) {
      const scale = new maplibregl.ScaleControl({ unit: 'metric' })
      map.addControl(scale, 'bottom-left')
      scaleRef.current = scale
    }
  }, [config.showScale])

  // ── 7. Zoom interaction ───────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (config.allowZoom === false) {
      map.scrollZoom.disable(); map.doubleClickZoom.disable(); map.boxZoom.disable()
    } else {
      map.scrollZoom.enable(); map.doubleClickZoom.enable(); map.boxZoom.enable()
    }
  }, [config.allowZoom])

  // ── 8. Pan interaction ────────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (config.allowPan === false) {
      map.dragPan.disable(); map.keyboard.disable()
    } else {
      map.dragPan.enable(); map.keyboard.enable()
    }
  }, [config.allowPan])

  // ── 9. Sync GIS layers ────────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded.current) return
    syncLayers(map, storeLayers, prevLayerIds, showLegendRef.current, showPopupRef, getConfig)
  }, [storeLayers])

  // ── 10. Zoom to layer ────────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded.current || !zoomToLayerId) return

    const layer = storeLayers.find(l => l.id === zoomToLayerId)
    if (layer?.data) {
      const bbox = getBBox(layer.data)
      if (bbox) map.fitBounds(bbox, { padding: 60, duration: 800, maxZoom: 18 })
    }

    useBuilderStore.setState({ zoomToLayerId: null })
  }, [zoomToLayerId]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── 11. Legend visibility ─────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoaded.current) return
    syncLayers(map, storeLayers, prevLayerIds, config.showLegend !== false, showPopupRef, getConfig)
  }, [config.showLegend]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
  )
}

export default MapWidget
