import { useState } from 'react'

export type StyleEntry =
  | { id: string; label: string; type: 'vector'; url: string; preview: string }
  | { id: string; label: string; type: 'raster'; tiles: string[]; attribution: string; preview: string }

export const BASEMAP_STYLES: StyleEntry[] = [
  // ── Vector (CARTO GL — free, no API key) ────────────────────────────
  // {
  //   id: 'vec-voyager',
  //   label: 'Voyager',
  //   type: 'vector',
  //   url: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  //   preview: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/2/1/1.png',
  // },
  // {
  //   id: 'vec-positron',
  //   label: 'Positron',
  //   type: 'vector',
  //   url: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  //   preview: 'https://a.basemaps.cartocdn.com/light_all/2/1/1.png',
  // },
  // {
  //   id: 'vec-dark',
  //   label: 'Dark Matter',
  //   type: 'vector',
  //   url: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  //   preview: 'https://a.basemaps.cartocdn.com/dark_all/2/1/1.png',
  // },
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

interface BasemapGalleryProps {
  activeId: string
  onSelect: (entry: StyleEntry) => void
}

function BasemapGallery({ activeId, onSelect }: BasemapGalleryProps) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Basemap gallery"
        style={{
          width:          32,
          height:         32,
          borderRadius:   '50%',
          border:         'none',
          background:     open ? '#0ea5e9' : 'rgba(255,255,255,0.88)',
          color:          open ? '#fff' : '#334155',
          boxShadow:      '0 2px 10px rgba(0,0,0,0.18)',
          cursor:         'pointer',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          backdropFilter: 'blur(12px)',
          transition:     'background 0.15s, color 0.15s',
          alignSelf:      'flex-end',
          marginRight:    8,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
          <line x1="9" y1="3" x2="9" y2="18"/>
          <line x1="15" y1="6" x2="15" y2="21"/>
        </svg>
      </button>

      {open && <div style={{
        display:        'flex',
        gap:            8,
        padding:        '8px 12px',
        background:     'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(12px)',
        borderRadius:   16,
        boxShadow:      '0 4px 24px rgba(0,0,0,0.15)',
        overflowX:      'auto',
        maxWidth:       '90vw',
      }}>
      {BASEMAP_STYLES.map(s => (
        <button
          key={s.id}
          onClick={() => onSelect(s)}
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
              position:      'absolute',
              top:           4,
              right:         4,
              fontSize:      9,
              fontWeight:    700,
              padding:       '1px 4px',
              borderRadius:  4,
              background:    s.type === 'vector' ? '#7c3aed' : '#0f172a',
              color:         '#fff',
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
      </div>}
    </div>
  )
}

export default BasemapGallery
