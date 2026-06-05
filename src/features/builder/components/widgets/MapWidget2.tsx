import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// @ts-ignore
maplibregl.workerUrl = `${process.env.PUBLIC_URL ?? ''}/maplibre-gl-csp-worker.js`

type StyleEntry =
  | { id: string; label: string; type: 'vector'; url: string; preview: string }
  | { id: string; label: string; type: 'raster'; tiles: string[]; attribution: string; preview: string }

const STYLES: StyleEntry[] = [
  // ── Vector ──────────────────────────────────────────────────────────
  {
    id: 'liberty',
    label: 'Liberty',
    type: 'vector',
    url: 'https://tiles.openfreemap.org/styles/liberty',
    preview: 'https://tile.openstreetmap.org/2/1/1.png',
  },
  {
    id: 'bright',
    label: 'Bright',
    type: 'vector',
    url: 'https://tiles.openfreemap.org/styles/bright',
    preview: 'https://tile.openstreetmap.org/2/2/1.png',
  },
  {
    id: 'positron',
    label: 'Positron',
    type: 'vector',
    url: 'https://tiles.openfreemap.org/styles/positron',
    preview: 'https://a.basemaps.cartocdn.com/light_all/2/1/1.png',
  },
  // ── Raster ──────────────────────────────────────────────────────────
  {
    id: 'satellite',
    label: 'Satellite',
    type: 'raster',
    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
    attribution: 'Tiles © Esri',
    preview: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/2/1/1',
  },
  {
    id: 'osm',
    label: 'OpenStreetMap',
    type: 'raster',
    tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
    attribution: '© OpenStreetMap contributors',
    preview: 'https://tile.openstreetmap.org/2/1/1.png',
  },
  {
    id: 'carto-light',
    label: 'Carto Light',
    type: 'raster',
    tiles: ['https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'],
    attribution: '© CartoDB',
    preview: 'https://a.basemaps.cartocdn.com/light_all/2/1/1.png',
  },
  {
    id: 'carto-dark',
    label: 'Carto Dark',
    type: 'raster',
    tiles: ['https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'],
    attribution: '© CartoDB',
    preview: 'https://a.basemaps.cartocdn.com/dark_all/2/1/1.png',
  },
  {
    id: 'voyager',
    label: 'Voyager',
    type: 'raster',
    tiles: ['https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'],
    attribution: '© CartoDB',
    preview: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/2/1/1.png',
  },
  {
    id: 'esri-topo',
    label: 'Topo',
    type: 'raster',
    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'],
    attribution: 'Tiles © Esri',
    preview: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/2/1/1',
  },
  {
    id: 'esri-relief',
    label: 'Shaded Relief',
    type: 'raster',
    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}'],
    attribution: 'Tiles © Esri',
    preview: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/2/1/1',
  },
]

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

const INITIAL_ID = 'satellite'

function MapWidget2() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<maplibregl.Map | null>(null)
  const [activeId, setActiveId] = useState(INITIAL_ID)

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return

    const initial = STYLES.find(s => s.id === INITIAL_ID)!
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

      {/* Style gallery */}
      <div style={{
        position:        'absolute',
        bottom:          20,
        left:            '50%',
        transform:       'translateX(-50%)',
        display:         'flex',
        gap:             8,
        padding:         '8px 12px',
        background:      'rgba(255,255,255,0.88)',
        backdropFilter:  'blur(12px)',
        borderRadius:    16,
        boxShadow:       '0 4px 24px rgba(0,0,0,0.15)',
        overflowX:       'auto',
        maxWidth:        '90vw',
        zIndex:          10,
      }}>
        {STYLES.map(s => (
          <button
            key={s.id}
            onClick={() => switchStyle(s)}
            title={s.label}
            style={{
              display:       'flex',
              flexDirection: 'column',
              alignItems:    'center',
              gap:           4,
              background:    'none',
              border:        activeId === s.id ? '2.5px solid #0ea5e9' : '2.5px solid transparent',
              borderRadius:  10,
              padding:       3,
              cursor:        'pointer',
              flexShrink:    0,
              transition:    'border-color 0.15s',
            }}
          >
            <div style={{ position: 'relative' }}>
              <img
                src={s.preview}
                alt={s.label}
                style={{ width: 58, height: 58, borderRadius: 7, objectFit: 'cover', display: 'block' }}
              />
              <span style={{
                position:     'absolute',
                top:          4,
                right:        4,
                fontSize:     9,
                fontWeight:   700,
                padding:      '1px 4px',
                borderRadius: 4,
                background:   s.type === 'vector' ? '#7c3aed' : '#0f172a',
                color:        '#fff',
                letterSpacing: '0.3px',
              }}>
                {s.type === 'vector' ? 'VEC' : 'RAS'}
              </span>
            </div>
            <span style={{
              fontSize:   10,
              color:      activeId === s.id ? '#0ea5e9' : '#334155',
              fontWeight: activeId === s.id ? 700 : 400,
              whiteSpace: 'nowrap',
            }}>
              {s.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default MapWidget2
