import { useState } from 'react'
import { useTheme } from '../../../context/ThemeContext'
import { useBuilderStore } from '../store/builderStore'
import { GeoLayer } from '../types/builder.types'

function csvToGeoJSON(text: string): { data: any; fields: string[] } {
  const lines = text.trim().split('\n').filter(l => l.trim())
  if (lines.length < 2) throw new Error('CSV file has no data rows')

  // detect separator: comma or semicolon
  const sep = lines[0].includes(';') ? ';' : ','

  const headers = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g, ''))

  // detect lat/lng columns by common names
  const latNames = ['lat', 'latitude', 'y', 'ylat', 'y_lat']
  const lngNames = ['lng', 'lon', 'longitude', 'long', 'x', 'xlon', 'xlong', 'x_lon']
  const latIdx = headers.findIndex(h => latNames.includes(h.toLowerCase()))
  const lngIdx = headers.findIndex(h => lngNames.includes(h.toLowerCase()))

  if (latIdx === -1 || lngIdx === -1) {
    throw new Error(
      `CSV must have latitude and longitude columns.\nFound columns: ${headers.join(', ')}`
    )
  }

  const features = lines
    .slice(1)
    .map(line => {
      const values = line.split(sep).map(v => v.trim().replace(/^"|"$/g, ''))
      const lat = parseFloat(values[latIdx])
      const lng = parseFloat(values[lngIdx])
      if (isNaN(lat) || isNaN(lng)) return null

      const properties: Record<string, any> = {}
      headers.forEach((h, i) => {
        if (i === latIdx || i === lngIdx) return
        const raw = values[i] ?? ''
        properties[h] = raw !== '' && !isNaN(Number(raw)) ? Number(raw) : raw
      })

      return {
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [lng, lat] },
        properties,
      }
    })
    .filter(Boolean)

  if (!features.length) throw new Error('No valid coordinate rows found in CSV')

  return {
    data: { type: 'FeatureCollection', features },
    fields: headers.filter((_, i) => i !== latIdx && i !== lngIdx),
  }
}

function LayersPanel() {
  const { lang } = useTheme()
  const layers      = useBuilderStore(s => s.layers)
  const addLayer    = useBuilderStore(s => s.addLayer)
  const toggleLayer = useBuilderStore(s => s.toggleLayer)
  const zoomToLayer = useBuilderStore(s => s.zoomToLayer)
  const [dotsMenuId, setDotsMenuId] = useState<string | null>(null)

  const t = {
    en: {
      title: 'Layers',
      add: '+ Add Layer',
      empty: 'No layers yet',
      emptyS: 'Click Add Layer to upload a file',
      delete: 'Delete Layer',
      rename: 'Rename',
      types: {
        geojson: 'GeoJSON', csv: 'CSV', wms: 'WMS',
        shapefile: 'SHP', kml: 'KML', gpx: 'GPX',
        'vector-tile': 'VT', raster: 'Raster', heatmap: 'Heat',
      },
    },
    ar: {
      title: 'الطبقات',
      add: '+ إضافة طبقة',
      empty: 'لا توجد طبقات',
      emptyS: 'اضغط إضافة طبقة لرفع ملف',
      delete: 'حذف الطبقة',
      rename: 'إعادة تسمية',
      types: {
        geojson: 'GeoJSON', csv: 'CSV', wms: 'WMS',
        shapefile: 'SHP', kml: 'KML', gpx: 'GPX',
        'vector-tile': 'VT', raster: 'راستر', heatmap: 'حرارة',
      },
    },
  }[lang]

  function handleAddLayer() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.geojson,.json,.csv,.kml,.gpx,.shp'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const ext = file.name.split('.').pop()?.toLowerCase()
      const typeMap: Record<string, GeoLayer['type']> = {
        geojson: 'geojson', json: 'geojson',
        csv: 'csv', kml: 'kml',
        gpx: 'gpx', shp: 'shapefile',
      }
      // ← اقرأ الـ file content
      const text = await file.text()
      let data: any = null
      let fields: string[] = []

      try {
        if (ext === 'geojson' || ext === 'json') {
          data = JSON.parse(text)
          const firstFeature = data.features?.[0]
          if (firstFeature?.properties) {
            fields = Object.keys(firstFeature.properties)
          }
        } else if (ext === 'csv') {
          const result = csvToGeoJSON(text)
          data   = result.data
          fields = result.fields
        }
      } catch (err) {
        console.error('Error parsing file:', err)
        alert(`Could not parse file: ${(err as Error).message}`)
        return
      }

      const newLayer: GeoLayer = {
        id: `layer-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: typeMap[ext ?? ''] ?? 'geojson',
        visible: true,
        color: ['#0ea5e9','#22c55e','#f59e0b','#ef4444','#8b5cf6'][layers.length % 5],
        data,      // ← الـ GeoJSON كامل
        fields,    // ← أسماء الـ fields
      }
      addLayer(newLayer)
    }
    input.click()
  }

  function handleDeleteLayer(id: string) {
    useBuilderStore.setState(state => ({
      layers: state.layers.filter(l => l.id !== id),
      isSaved: false,
    }))
    setDotsMenuId(null)
  }

  return (
    <aside style={{
      width:                '240px',
      background:           'rgba(255,255,255,0.80)',
      backdropFilter:       'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border:               '1px solid rgba(255,255,255,0.88)',
      borderRadius:         '12px',
      boxShadow:            '0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
      display:              'flex',
      flexDirection:        'column',
      flexShrink:           0,
      position:             'relative',
      marginBottom:         '8px',
    } as React.CSSProperties}>

      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          fontSize: '13px',
          fontWeight: '600',
          color: 'var(--text-primary)',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 10l6 3 6-3M1 7l6 3 6-3M1 4l6-3 6 3-6 3-6-3z"/>
          </svg>
          {t.title}
        </div>
        <button
          onClick={handleAddLayer}
          style={{
            background: 'var(--accent-light)',
            border: 'none',
            color: 'var(--accent)',
            fontSize: '11px',
            fontWeight: '600',
            padding: '3px 8px',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
          }}
        >
          {t.add}
        </button>
      </div>

      {/* Layers list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {layers.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '32px 16px',
            color: 'var(--text-muted)',
          }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
              stroke="currentColor" strokeWidth="1.2"
              style={{ marginBottom: '8px', opacity: 0.4 }}>
              <path d="M4 22l12 6 12-6M4 16l12 6 12-6M4 10l12-6 12 6-12 6-12-6z"/>
            </svg>
            <p style={{ fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>
              {t.empty}
            </p>
            <p style={{ fontSize: '11px' }}>{t.emptyS}</p>
          </div>
        ) : (
          layers.map(layer => (
            <div
              key={layer.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 10px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '2px',
                transition: 'background 0.15s',
                position: 'relative',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--page-bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Color dot */}
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: layer.color,
                flexShrink: 0,
              }} />

              {/* Name */}
              <span style={{
                flex: 1,
                fontSize: '12px',
                color: layer.visible ? 'var(--text-primary)' : 'var(--text-muted)',
                fontWeight: '500',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {layer.name}
              </span>

              {/* Type badge */}
              <span style={{
                fontSize: '10px',
                color: 'var(--text-muted)',
                background: 'var(--page-bg)',
                padding: '1px 5px',
                borderRadius: '3px',
                border: '1px solid var(--border)',
                flexShrink: 0,
              }}>
                {t.types[layer.type]}
              </span>

              {/* Visibility toggle */}
              <button
                onClick={() => toggleLayer(layer.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: layer.visible ? 'var(--text-secondary)' : 'var(--text-muted)',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                {layer.visible ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 7s2.5-4.5 6-4.5S13 7 13 7s-2.5 4.5-6 4.5S1 7 1 7z"/>
                    <circle cx="7" cy="7" r="1.5"/>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M1 1l12 12M5.5 5.7A2 2 0 0 0 9 9M3 3.3C1.8 4.4 1 7 1 7s2.5 4.5 6 4.5c1 0 2-.3 2.8-.7M6 2.6C6.3 2.5 6.7 2.5 7 2.5c3.5 0 6 4.5 6 4.5s-.5 1-1.5 2"/>
                  </svg>
                )}
              </button>

              {/* Dots menu button */}
              <button
                onClick={() => setDotsMenuId(dotsMenuId === layer.id ? null : layer.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  padding: '2px 4px',
                  fontSize: '16px',
                  lineHeight: 1,
                  flexShrink: 0,
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                ⋮
              </button>

              {/* Dots dropdown */}
              {dotsMenuId === layer.id && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  ...(lang === 'ar' ? { left: '8px' } : { right: '8px' }),
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  zIndex: 100,
                  minWidth: '140px',
                  overflow: 'hidden',
                }}>
                  {/* Zoom to layer */}
                  {layer.data && (
                    <button
                      onClick={() => { zoomToLayer(layer.id); setDotsMenuId(null) }}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        background: 'transparent',
                        border: 'none',
                        borderBottom: '1px solid var(--border)',
                        textAlign: lang === 'ar' ? 'right' : 'left',
                        fontSize: '13px',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--page-bg)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="5.5" cy="5.5" r="4"/>
                        <line x1="8.5" y1="8.5" x2="12" y2="12"/>
                        <line x1="5.5" y1="3.5" x2="5.5" y2="7.5"/>
                        <line x1="3.5" y1="5.5" x2="7.5" y2="5.5"/>
                      </svg>
                      {lang === 'ar' ? 'تكبير على الطبقة' : 'Zoom to Layer'}
                    </button>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteLayer(layer.id)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '13px',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="1 3 12 3"/>
                      <path d="M4 3V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1"/>
                      <path d="M2 3l.7 8a1 1 0 0 0 1 .9h5.6a1 1 0 0 0 1-.9L11 3"/>
                    </svg>
                    {t.delete}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Close dots menu on outside click */}
      {dotsMenuId && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99 }}
          onClick={() => setDotsMenuId(null)}
        />
      )}
    </aside>
  )
}

export default LayersPanel