import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import BasemapGallery, { BASEMAP_STYLES, StyleEntry } from './map/BasemapGallery'

// @ts-ignore
maplibregl.workerUrl = `${process.env.PUBLIC_URL ?? ''}/maplibre-gl-csp-worker.js`

const INITIAL_ID = 'satellite'

function buildRasterStyle(entry: Extract<StyleEntry, { type: 'raster' }>): maplibregl.StyleSpecification {
  return {
    version: 8,
    sources: {
      base: { type: 'raster', tiles: entry.tiles, tileSize: 256, attribution: entry.attribution },
    },
    layers: [{ id: 'base-layer', type: 'raster', source: 'base' }],
  }
}

function getStyle(entry: StyleEntry) {
  return entry.type === 'vector'
    ? entry.url
    : buildRasterStyle(entry as Extract<StyleEntry, { type: 'raster' }>)
}

function MapWidget2() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<maplibregl.Map | null>(null)
  const [activeId, setActiveId] = useState(INITIAL_ID)

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return

    const initial = BASEMAP_STYLES.find(s => s.id === INITIAL_ID)!
    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: getStyle(initial),
      center: [0, 0],
      zoom: 2,
    })

    return () => {
      mapInstance.current?.remove()
      mapInstance.current = null
    }
  }, [])

  function switchStyle(entry: StyleEntry) {
    if (!mapInstance.current || entry.id === activeId) return
    mapInstance.current.setStyle(getStyle(entry))
    setActiveId(entry.id)
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      <BasemapGallery activeId={activeId} onSelect={switchStyle} />
    </div>
  )
}

export default MapWidget2
