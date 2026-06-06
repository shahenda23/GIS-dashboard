import { useState } from 'react'
import MapWidget, { MAPBOX_TOKEN, MAP_STYLES, styleUrlToStaticId } from './MapWidget2'
import type { MapConfig } from '../../types/builder.types'

interface LazyMapWidgetProps {
  widgetId: string
  config: Partial<MapConfig>
}

// ── Build the Mapbox Static Images API URL ────────────────────────────────────
// This is a free API — requests do NOT count as map loads.
// Browser caches the image, so repeated views of the same map = 0 extra cost.
function buildStaticUrl(config: Partial<MapConfig>, width: number, height: number): string {
  const lon   = (config as any).center?.[0] ?? 31.2357
  const lat   = (config as any).center?.[1] ?? 30.0444
  const zoom  = config.zoom ?? 10
  const style = styleUrlToStaticId(config.mapStyle ?? MAP_STYLES[0].value)

  // Clamp to max 1280px (Static Images API limit)
  const w = Math.min(Math.round(width)  || 800, 1280)
  const h = Math.min(Math.round(height) || 400, 1280)

  return `https://api.mapbox.com/styles/v1/${style}/static/${lon},${lat},${zoom}/${w}x${h}?access_token=${MAPBOX_TOKEN}`
}

// ── Placeholder component ─────────────────────────────────────────────────────
function StaticMapPlaceholder({
  config,
  onActivate,
}: {
  config: Partial<MapConfig>
  onActivate: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Use a reasonable default size; the <img> stretches to fill the container
  const staticUrl = buildStaticUrl(config, 800, 400)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '4px',
        background: '#e8e0d0',
        cursor: 'pointer',
      }}
      onClick={onActivate}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Static map image */}
      {!imgError ? (
        <img
          src={staticUrl}
          alt="Map preview"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            filter: hovered ? 'brightness(0.85)' : 'none',
            transition: 'filter 0.2s',
          }}
          onError={() => setImgError(true)}
        />
      ) : (
        /* Fallback if static image fails (e.g. token not set yet) */
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #d4cbb8 0%, #b8b0a0 100%)',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6b6455" strokeWidth="1.5">
            <path d="M3 11l19-9-9 19-2-8-8-2z"/>
          </svg>
        </div>
      )}

      {/* Activate overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s',
          background: 'rgba(0,0,0,0.25)',
        }}
      >
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'rgba(255,255,255,0.95)',
            border: 'none',
            borderRadius: '24px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#1a1a1a',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            fontFamily: 'sans-serif',
            letterSpacing: '0.01em',
          }}
        >
          {/* Map pin icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          Open Interactive Map
        </button>
      </div>

      {/* Bottom-right: subtle "map preview" badge */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          background: 'rgba(255,255,255,0.85)',
          borderRadius: '6px',
          padding: '3px 7px',
          fontSize: '10px',
          color: '#555',
          fontFamily: 'sans-serif',
          pointerEvents: 'none',
          backdropFilter: 'blur(4px)',
        }}
      >
        Preview — click to interact
      </div>
    </div>
  )
}

// ── LazyMapWidget ─────────────────────────────────────────────────────────────
// Drop-in replacement for <MapWidget> in DashboardViewPage.
// Shows a static image (0 map loads). Swaps to real GL map only on click (1 load).
// Once activated this session, stays active (no re-activation needed on re-render).
function LazyMapWidget({ widgetId, config }: LazyMapWidgetProps) {
  // Session-level memory: once activated per widget per session, don't re-show placeholder
  const sessionKey = `map_activated_${widgetId}`
  const [activated, setActivated] = useState(
    () => sessionStorage.getItem(sessionKey) === '1'
  )

  function handleActivate() {
    sessionStorage.setItem(sessionKey, '1')
    setActivated(true)
  }

  if (!activated) {
    return <StaticMapPlaceholder config={config} onActivate={handleActivate} />
  }

  return <MapWidget widgetId={widgetId} config={config} />
}

export default LazyMapWidget