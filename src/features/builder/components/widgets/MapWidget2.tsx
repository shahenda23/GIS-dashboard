import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// @ts-ignore
maplibregl.workerUrl = `${process.env.PUBLIC_URL ?? ''}/maplibre-gl-csp-worker.js`

const MAP_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    satellite: {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      attribution: 'Tiles © Esri',
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: 'satellite-layer',
      type: 'raster',
      source: 'satellite',
      minzoom: 0,
      maxzoom: 22,
    },
  ],
}

function MapWidget2() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return

    mapInstance.current = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: [0, 0],
      zoom: 2,
    })

    return () => {
      mapInstance.current?.remove()
      mapInstance.current = null
    }
  }, [])

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
}

export default MapWidget2
