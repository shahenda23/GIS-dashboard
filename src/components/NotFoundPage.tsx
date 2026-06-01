import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const { lang } = useTheme()

  const t = {
    en: {
      title:  'Page Not Found',
      body:   "These coordinates don't exist on the map. The page you're looking for has moved, been removed, or never existed.",
      button: 'Back to Home',
    },
    ar: {
      title:  'الصفحة غير موجودة',
      body:   'هذه الإحداثيات غير موجودة على الخريطة. الصفحة التي تبحث عنها تم نقلها أو حذفها أو لم تكن موجودة أصلاً.',
      button: 'العودة للرئيسية',
    },
  }[lang]

  return (
    <>
      <style>{`
        @keyframes nf-float {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-7px); }
        }
        @keyframes nf-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nf-radar {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes nf-ping {
          0%   { opacity: 0.8; transform: scale(1); }
          100% { opacity: 0;   transform: scale(3.2); }
        }
      `}</style>

      <div style={{
        minHeight:      '100vh',
        background:     'var(--page-bg)',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        position:       'relative',
        overflow:       'hidden',
        padding:        '40px 20px',
      }}>

        {/* dot-grid background */}
        <div style={{
          position:           'absolute',
          inset:              0,
          backgroundImage:    `
            radial-gradient(circle, var(--border) 1.2px, transparent 1.2px),
            radial-gradient(circle, var(--border) 1.2px, transparent 1.2px)
          `,
          backgroundSize:     '36px 18px',
          backgroundPosition: '0 0, 18px 9px',
          opacity:            0.55,
          pointerEvents:      'none',
        }} />

        {/* ─── illustration ─── */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg
            width="580" height="450" viewBox="0 0 580 450"
            style={{ animation: 'nf-float 5s ease-in-out infinite', overflow: 'visible' }}
          >
            <defs>
              <clipPath id="nfMapSurface">
                <polygon points="148,135 490,98 490,312 148,349"/>
              </clipPath>
            </defs>

            {/* ── Floating card: search bar (top-left) ── */}
            <g transform="translate(22,30)" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}>
              <rect width="128" height="52" rx="10" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.2"/>
              <circle cx="22" cy="26" r="8" fill="none" stroke="var(--border)" strokeWidth="1.8"/>
              <line x1="28" y1="32" x2="34" y2="38" stroke="var(--border)" strokeWidth="1.8" strokeLinecap="round"/>
              <rect x="40" y="21" width="72" height="6" rx="3" fill="var(--border)" opacity="0.6"/>
              <rect x="40" y="30" width="50" height="4" rx="2" fill="var(--border)" opacity="0.35"/>
              <text x="108" y="32" fontSize="15" fill="#f59e0b" fontWeight="900" fontFamily="monospace">?</text>
            </g>

            {/* ── Floating card: 404 badge (top-center) ── */}
            <g transform="translate(228,14)" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}>
              <rect width="104" height="56" rx="10" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.2"/>
              <text x="52" y="38" textAnchor="middle" fontSize="28" fontWeight="900" fill="#3b82f6"
                fontFamily="system-ui, monospace" letterSpacing="-1">404</text>
              <text x="52" y="50" textAnchor="middle" fontSize="8" fill="var(--text-secondary)"
                fontFamily="system-ui, sans-serif" letterSpacing="1">NOT FOUND</text>
            </g>

            {/* ── Floating card: coordinates (top-right) ── */}
            <g transform="translate(394,12)" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}>
              <rect width="158" height="90" rx="10" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.2"/>
              <line x1="0" y1="26" x2="158" y2="26" stroke="var(--border)" strokeWidth="0.8"/>
              <rect x="10" y="10" width="56" height="7" rx="3" fill="var(--border)"/>
              <text x="10" y="46" fontSize="10" fill="var(--text-secondary)" fontFamily="monospace">LAT:</text>
              <text x="40" y="46" fontSize="10" fill="#ef4444" fontFamily="monospace">???.????°</text>
              <text x="10" y="63" fontSize="10" fill="var(--text-secondary)" fontFamily="monospace">LNG:</text>
              <text x="40" y="63" fontSize="10" fill="#ef4444" fontFamily="monospace">???.????°</text>
              <text x="10" y="80" fontSize="9" fill="var(--text-secondary)" fontFamily="monospace" opacity="0.55">SIGNAL LOST</text>
            </g>

            {/* ── Floating card: scatter (bottom-right) ── */}
            <g transform="translate(462,310)" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}>
              <rect width="106" height="72" rx="8" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.2"/>
              <line x1="0" y1="22" x2="106" y2="22" stroke="var(--border)" strokeWidth="0.8"/>
              <rect x="8" y="8" width="36" height="6" rx="3" fill="var(--border)"/>
              {([[16,48],[30,38],[44,55],[58,34],[72,44],[86,38]] as [number,number][]).map(([x,y],i) => (
                <circle key={i} cx={x} cy={y} r="3" fill={['#93c5fd','#6ee7b7','#fca5a5','#fcd34d','#93c5fd','#6ee7b7'][i]}/>
              ))}
              <polyline points="16,48 30,38 44,55 58,34 72,44 86,38"
                fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 2" opacity="0.5"/>
            </g>

            {/* ── Floating card: color bars (bottom-right-2) ── */}
            <g transform="translate(462,392)" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}>
              <rect width="106" height="50" rx="8" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.2"/>
              {([['#93c5fd',55],['#6ee7b7',38],['#fcd34d',72],['#fca5a5',44]] as [string,number][]).map(([c,w],i) => (
                <rect key={i} x="8" y={9+i*10} width={w} height="7" rx="3" fill={c} opacity="0.8"/>
              ))}
            </g>

            {/* ─── ISOMETRIC MAP TABLET ─── */}
            <ellipse cx="320" cy="378" rx="180" ry="16" fill="rgba(0,0,0,0.08)"/>

            {/* Right face */}
            <polygon points="490,98 512,114 512,328 490,312" fill="#b8c2cc"/>
            {/* Bottom face */}
            <polygon points="148,349 490,312 512,328 170,365" fill="#c2ccd4"/>
            {/* Map surface */}
            <polygon points="148,135 490,98 490,312 148,349" fill="#e8f0f8"/>

            <g clipPath="url(#nfMapSurface)">
              {/* Street grid - horizontal */}
              {[0.18,0.33,0.50,0.66,0.82].map(frac => (
                <line key={frac}
                  x1="148" y1={135+frac*(349-135)}
                  x2="490" y2={98+frac*(312-98)}
                  stroke="#d4e0ec" strokeWidth="2.5"/>
              ))}
              {/* Street grid - vertical */}
              {[220,290,360,430].map(x => {
                const topY = 135+(x-148)*(98-135)/(490-148)
                const botY = 349+(x-148)*(312-349)/(490-148)
                return <line key={x} x1={x} y1={topY} x2={x} y2={botY} stroke="#d4e0ec" strokeWidth="2.5"/>
              })}

              {/* Terrain */}
              <ellipse cx="210" cy="178" rx="55" ry="32" fill="#b8d4a0" opacity="0.6"/>
              <ellipse cx="330" cy="230" rx="65" ry="42" fill="#a8c0d8" opacity="0.5"/>
              <ellipse cx="440" cy="280" rx="42" ry="26" fill="#a8c890" opacity="0.5"/>
              <ellipse cx="430" cy="158" rx="32" ry="18" fill="#90b8d0" opacity="0.55"/>
              <ellipse cx="195" cy="295" rx="28" ry="18" fill="#c8d8a8" opacity="0.5"/>

              {/* Radar rings */}
              <circle cx="320" cy="210" r="30" fill="none" stroke="rgba(59,130,246,0.28)" strokeWidth="1.5"/>
              <circle cx="320" cy="210" r="60" fill="none" stroke="rgba(59,130,246,0.20)" strokeWidth="1.5"/>
              <circle cx="320" cy="210" r="88" fill="none" stroke="rgba(59,130,246,0.13)" strokeWidth="1.5"/>

              {/* Radar sweep arm */}
              <g style={{ transformOrigin: '320px 210px', animation: 'nf-radar 3s linear infinite' }}>
                <line x1="320" y1="210" x2="395" y2="170"
                  stroke="rgba(59,130,246,0.75)" strokeWidth="2.2" strokeLinecap="round"/>
                <path d="M320 210 L395 170 A88 88 0 0 0 320 122 Z"
                  fill="rgba(59,130,246,0.09)" stroke="none"/>
              </g>

              {/* Pulsing "missing" pin */}
              <circle cx="320" cy="210" r="5" fill="#3b82f6"/>
              <circle cx="320" cy="210" r="5" fill="none" stroke="#3b82f6" strokeWidth="1.5"
                style={{ animation: 'nf-ping 2s ease-out infinite', transformOrigin: '320px 210px' }}/>
              <circle cx="320" cy="210" r="5" fill="none" stroke="#3b82f6" strokeWidth="1.5"
                style={{ animation: 'nf-ping 2s ease-out 1s infinite', transformOrigin: '320px 210px' }}/>

              {/* "?" marker */}
              <text x="316" y="168" fontSize="38" fontWeight="900"
                fill="#3b82f6" opacity="0.85" fontFamily="system-ui, sans-serif">?</text>
            </g>

            {/* Tablet border */}
            <polygon points="148,135 490,98 490,312 148,349" fill="none" stroke="#c8d0d8" strokeWidth="2"/>
            <rect x="144" y="131" width="10" height="10" rx="3" fill="#a8b2be"/>
            <rect x="486" y="94"  width="10" height="10" rx="3" fill="#a8b2be"/>
            <rect x="486" y="308" width="10" height="10" rx="3" fill="#a8b2be"/>
            <rect x="144" y="345" width="10" height="10" rx="3" fill="#a8b2be"/>

            {/* Location pins */}
            <g transform="translate(370,118)">
              <path d="M9 0C4 0 0 4 0 9 0 15.7 9 25 9 25S18 15.7 18 9C18 4 14 0 9 0Z" fill="#3b82f6"/>
              <circle cx="9" cy="9" r="4" fill="white" opacity="0.9"/>
            </g>
            <g transform="translate(428,162)" opacity="0.45">
              <path d="M9 0C4 0 0 4 0 9 0 15.7 9 25 9 25S18 15.7 18 9C18 4 14 0 9 0Z" fill="#94a3b8" strokeDasharray="3 2"/>
              <circle cx="9" cy="9" r="4" fill="white" opacity="0.6"/>
            </g>

            {/* ─── ROBOT CHARACTER (searching) ─── */}
            <g transform="translate(35,178)">
              <ellipse cx="60" cy="183" rx="54" ry="9" fill="rgba(0,0,0,0.09)"/>

              {/* Backpack */}
              <rect x="93" y="72" width="24" height="42" rx="7" fill="#3b82f6" stroke="#2563eb" strokeWidth="1.2"/>
              <rect x="93" y="79" width="10" height="5" rx="2" fill="#2563eb"/>
              <rect x="93" y="100" width="10" height="5" rx="2" fill="#2563eb"/>
              <rect x="103" y="81" width="5" height="26" rx="2" fill="#2563eb"/>

              {/* Hat */}
              <ellipse cx="60" cy="30" rx="52" ry="10" fill="#2563eb"/>
              <path d="M14 30 C12 2 108 2 106 30" fill="#3b82f6"/>
              <rect x="14" y="22" width="92" height="11" rx="3" fill="#1d4ed8"/>
              <circle cx="60" cy="29" r="11" fill="#1e1e2e" stroke="#555" strokeWidth="1.5"/>
              <circle cx="60" cy="29" r="7" fill="#0ea5e9" opacity="0.65"/>
              <circle cx="56" cy="26" r="2.5" fill="white" opacity="0.55"/>

              {/* Body */}
              <ellipse cx="60" cy="116" rx="44" ry="56" fill="#dce8f2" stroke="#c8d8e8" strokeWidth="1.5"/>
              <ellipse cx="46" cy="92" rx="18" ry="14" fill="white" opacity="0.35"/>

              {/* Eyes — looking right (searching) */}
              <circle cx="42" cy="96" r="10" fill="white" stroke="#b8c8d8" strokeWidth="1.2"/>
              <circle cx="78" cy="96" r="10" fill="white" stroke="#b8c8d8" strokeWidth="1.2"/>
              <circle cx="46" cy="96" r="6" fill="#3b82f6"/>
              <circle cx="82" cy="96" r="6" fill="#3b82f6"/>
              <circle cx="44" cy="93" r="2.5" fill="white" opacity="0.8"/>
              <circle cx="80" cy="93" r="2.5" fill="white" opacity="0.8"/>
              {/* Raised/curious eyebrows */}
              <path d="M33 83 Q42 77 51 81" stroke="#7090a0" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M69 81 Q78 77 87 83" stroke="#7090a0" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              {/* Curious/open mouth */}
              <path d="M44 118 Q60 124 76 118" stroke="#8098a8" strokeWidth="2.2" fill="none" strokeLinecap="round"/>

              {/* Left arm — holding magnifying glass */}
              <path d="M18 108 Q0 100 -10 88" stroke="#c8d8e8" strokeWidth="13" strokeLinecap="round" fill="none"/>
              <circle cx="-14" cy="76" r="14" fill="none" stroke="#3b82f6" strokeWidth="3.5"/>
              <circle cx="-14" cy="76" r="10" fill="rgba(147,197,253,0.2)"/>
              <circle cx="-18" cy="72" r="3" fill="rgba(255,255,255,0.45)"/>
              <line x1="-3" y1="87" x2="6" y2="96" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round"/>

              {/* Right arm */}
              <path d="M102 108 Q116 104 118 94" stroke="#c8d8e8" strokeWidth="13" strokeLinecap="round" fill="none"/>

              {/* Legs */}
              <ellipse cx="42" cy="164" rx="14" ry="18" fill="#c8d8e8" stroke="#b8c8d8" strokeWidth="1.2"/>
              <ellipse cx="78" cy="164" rx="14" ry="18" fill="#c8d8e8" stroke="#b8c8d8" strokeWidth="1.2"/>
              <ellipse cx="38" cy="179" rx="18" ry="7" fill="#8898a8"/>
              <ellipse cx="78" cy="179" rx="18" ry="7" fill="#8898a8"/>
            </g>

            {/* LayersPanel badge */}
            <g transform="translate(82,370)">
              <rect width="100" height="22" rx="6" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.2"
                style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.1))' }}/>
              <text x="50" y="15" textAnchor="middle" fontSize="11" fill="var(--text-secondary)"
                fontFamily="system-ui, sans-serif" fontWeight="500">LayersPanel</text>
            </g>

            {/* DB cylinders */}
            <g transform="translate(380,390)">
              <ellipse cx="30" cy="8"  rx="24" ry="8"   fill="#94a3b8"/>
              <rect    x="6"  y="8"   width="48" height="24" fill="#94a3b8"/>
              <ellipse cx="30" cy="32" rx="24" ry="8"   fill="#7a8fa0"/>
              <ellipse cx="18" cy="28" rx="15" ry="5.5" fill="#64748b"/>
              <rect    x="3"  y="28"  width="30" height="16" fill="#64748b"/>
              <ellipse cx="18" cy="44" rx="15" ry="5.5" fill="#4e6070"/>
            </g>

          </svg>
        </div>

        {/* ─── text below illustration ─── */}
        <div style={{
          position:   'relative',
          zIndex:     3,
          textAlign:  'center',
          animation:  'nf-fade-up 0.5s ease both',
          marginTop:  '-10px',
          direction:  lang === 'ar' ? 'rtl' : 'ltr',
        }}>
          <h1 style={{
            fontSize: '26px', fontWeight: '800', color: 'var(--text-primary)',
            margin: '0 0 10px', letterSpacing: '-0.5px', lineHeight: 1.25,
          }}>
            {t.title}
          </h1>
          <p style={{
            fontSize: '14px', color: 'var(--text-secondary)',
            margin: '0 0 24px', lineHeight: '1.7', maxWidth: '400px',
          }}>
            {t.body}
          </p>
          <button
            onClick={() => navigate('/')}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)' }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 22px', background: 'var(--accent)', border: 'none',
              borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '600',
              color: '#fff', cursor: 'pointer', transition: 'background 0.2s',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M11 14L6 9l5-5"/>
            </svg>
            {t.button}
          </button>
        </div>

      </div>
    </>
  )
}
