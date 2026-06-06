import { useEffect, useRef, useState } from 'react'
import * as maptilersdk from '@maptiler/sdk'
import '@maptiler/sdk/dist/maptiler-sdk.css'

maptilersdk.config.apiKey = 'ydeUYqeXv8WFtyvDNyef'

const KEY = 'ydeUYqeXv8WFtyvDNyef'

interface StyleOption {
  id: string
  label: string
  style: maptilersdk.ReferenceMapStyle
  preview: string
}

const STYLES: StyleOption[] = [
  {
    id: 'satellite',
    label: 'Satellite',
    style: maptilersdk.MapStyle.SATELLITE,
    preview: `https://api.maptiler.com/maps/satellite/256/2/1/1.jpg?key=${KEY}`,
  },
  {
    id: 'hybrid',
    label: 'Hybrid',
    style: maptilersdk.MapStyle.HYBRID,
    preview: `https://api.maptiler.com/maps/hybrid/256/2/1/1.png?key=${KEY}`,
  },
  {
    id: 'streets',
    label: 'Streets',
    style: maptilersdk.MapStyle.STREETS,
    preview: `https://api.maptiler.com/maps/streets-v2/256/2/1/1.png?key=${KEY}`,
  },
  {
    id: 'outdoor',
    label: 'Outdoor',
    style: maptilersdk.MapStyle.OUTDOOR,
    preview: `https://api.maptiler.com/maps/outdoor-v2/256/2/1/1.png?key=${KEY}`,
  },
  {
    id: 'topo',
    label: 'Topo',
    style: maptilersdk.MapStyle.TOPO,
    preview: `https://api.maptiler.com/maps/topo-v2/256/2/1/1.png?key=${KEY}`,
  },
  {
    id: 'basic',
    label: 'Basic',
    style: maptilersdk.MapStyle.BASIC,
    preview: `https://api.maptiler.com/maps/basic-v2/256/2/1/1.png?key=${KEY}`,
  },
]

function MapWidget() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance  = useRef<maptilersdk.Map | null>(null)
  const [activeId, setActiveId] = useState('satellite')
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return

    mapInstance.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.SATELLITE,
      center: [31.2357, 30.0444],
      zoom: 6,
    })

    return () => {
      mapInstance.current?.remove()
      mapInstance.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapContainer.current) return
    const ro = new ResizeObserver(() => mapInstance.current?.resize())
    ro.observe(mapContainer.current)
    return () => ro.disconnect()
  }, [])

  function switchStyle(s: StyleOption) {
    if (!mapInstance.current || s.id === activeId) return
    mapInstance.current.setStyle(s.style)
    setActiveId(s.id)
    setOpen(false)
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {/* Gallery */}
      <div style={{
        position:       'absolute',
        bottom:         20,
        left:           '50%',
        transform:      'translateX(-50%)',
        zIndex:         10,
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        gap:            6,
      }}>

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

        {/* Style strip */}
        {open && (
          <div style={{
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
                <img
                  src={s.preview}
                  alt={s.label}
                  style={{ width: 58, height: 58, borderRadius: 7, objectFit: 'cover', display: 'block' }}
                  onError={e => { (e.target as HTMLImageElement).style.background = '#e2e8f0' }}
                />
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
        )}
      </div>
    </div>
  )
}

export default MapWidget
