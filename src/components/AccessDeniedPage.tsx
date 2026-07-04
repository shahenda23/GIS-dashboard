import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

export default function AccessDeniedPage() {
  const navigate = useNavigate()
  const { lang } = useTheme()

  const t = {
    en: {
      brand:  'GIS Dashboard Builder',
      title:  'Access Restricted',
      body:   "You don't have permission to edit this dashboard. Contact the owner to request access.",
      button: 'Back to Home',
    },
    ar: {
      brand:  'GIS Dashboard Builder',
      title:  'وصول مقيد',
      body:   'ليس لديك صلاحية تعديل هذه اللوحة. تواصل مع المالك لطلب الوصول.',
      button: 'العودة للرئيسية',
    },
  }[lang]

  return (
    <>
      <style>{`
        @keyframes float-scene {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-7px); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink-dot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.25; }
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

        {/* Isometric dot-grid background */}
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
        <div style={{ position:'relative', zIndex:2, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg
            width="580" height="450" viewBox="0 0 580 450"
            style={{ animation:'float-scene 5s ease-in-out infinite', overflow:'visible' }}
          >
            <defs>
              <clipPath id="mapSurface">
                <polygon points="148,135 490,98 490,312 148,349"/>
              </clipPath>
            </defs>

            {/* ── Floating card: Map preview (top-left) ── */}
            <g transform="translate(22,30)" style={{ filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}>
              <rect width="128" height="88" rx="10" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.2"/>
              <rect x="1" y="1" width="126" height="24" rx="9" fill="#d4edd0"/>
              <rect x="1" y="25" width="126" height="62" rx="0" fill="#d4edd0"/>
              <rect x="1" y="63" width="126" height="24" rx="9" fill="#d4edd0" style={{borderBottomLeftRadius:9, borderBottomRightRadius:9}}/>
              {/* Map lines on card */}
              <path d="M10 55 Q35 45 64 55 Q92 65 118 50" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M64 25 Q58 40 64 55 Q70 70 64 88" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
              {/* Location pin on card */}
              <path d="M64 36 C60 36 57 39 57 43 C57 48 64 56 64 56 C64 56 71 48 71 43 C71 39 68 36 64 36 Z" fill="#4a90d9"/>
              <circle cx="64" cy="43" r="3" fill="white"/>
              {/* Card header lines */}
              <rect x="8" y="74" width="50" height="6" rx="3" fill="rgba(255,255,255,0.6)"/>
              <rect x="8" y="82" width="35" height="4" rx="2" fill="rgba(255,255,255,0.4)"/>
            </g>

            {/* ── Floating card: Line chart (top-center) ── */}
            <g transform="translate(220,18)" style={{ filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}>
              <rect width="120" height="82" rx="10" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.2"/>
              <line x1="0" y1="26" x2="120" y2="26" stroke="var(--border)" strokeWidth="0.8"/>
              <rect x="10" y="10" width="48" height="8" rx="4" fill="var(--border)"/>
              <rect x="62" y="12" width="20" height="5" rx="2" fill="var(--border)" opacity="0.5"/>
              <polyline points="12,66 28,54 44,60 60,44 76,50 92,38 108,42"
                fill="none" stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="12,66 28,54 44,60 60,44 76,50 92,38 108,42"
                fill="none" stroke="var(--accent)" strokeWidth="9" opacity="0.1" strokeLinecap="round" strokeLinejoin="round"/>
              {[28,44,60,76,92].map(x => <circle key={x} cx={x} cy={[54,60,44,50,38][[28,44,60,76,92].indexOf(x)]} r="2.5" fill="var(--accent)"/>)}
            </g>

            {/* ── Floating card: Bar + Pie (top-right) ── */}
            <g transform="translate(390,12)" style={{ filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}>
              <rect width="160" height="110" rx="10" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.2"/>
              <line x1="0" y1="28" x2="160" y2="28" stroke="var(--border)" strokeWidth="0.8"/>
              <rect x="10" y="11" width="50" height="7" rx="3" fill="var(--border)"/>
              {/* Bars */}
              {[[12,38],[32,25],[52,48],[72,20],[92,35]].map(([x,h],i) => (
                <rect key={i} x={x} y={98-h} width="16" height={h} rx="3"
                  fill={['#93c5fd','#6ee7b7','#93c5fd','#fcd34d','#93c5fd'][i]} opacity="0.85"/>
              ))}
              {/* Pie chart (right side) */}
              <circle cx="130" cy="72" r="28" fill="none" stroke="#e5e7eb" strokeWidth="20"/>
              <circle cx="130" cy="72" r="28" fill="none" stroke="#93c5fd" strokeWidth="20"
                strokeDasharray="53 132" strokeDashoffset="33"/>
              <circle cx="130" cy="72" r="28" fill="none" stroke="#6ee7b7" strokeWidth="20"
                strokeDasharray="35 132" strokeDashoffset="-20"/>
              <circle cx="130" cy="72" r="28" fill="none" stroke="#fcd34d" strokeWidth="20"
                strokeDasharray="25 132" strokeDashoffset="-55"/>
              <circle cx="130" cy="72" r="15" fill="var(--surface)"/>
            </g>

            {/* ── Floating card: Scatter/table (bottom-right) ── */}
            <g transform="translate(462,310)" style={{ filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}>
              <rect width="106" height="72" rx="8" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.2"/>
              <line x1="0" y1="22" x2="106" y2="22" stroke="var(--border)" strokeWidth="0.8"/>
              <rect x="8" y="8" width="36" height="6" rx="3" fill="var(--border)"/>
              {[[16,48],[30,38],[44,55],[58,34],[72,44],[86,38]].map(([x,y],i) => (
                <circle key={i} cx={x} cy={y} r="3" fill={['#93c5fd','#6ee7b7','#fca5a5','#fcd34d','#93c5fd','#6ee7b7'][i]}/>
              ))}
              <polyline points="16,48 30,38 44,55 58,34 72,44 86,38"
                fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 2" opacity="0.5"/>
            </g>

            {/* ── Floating card: Color bars (bottom-right-2) ── */}
            <g transform="translate(462,392)" style={{ filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}>
              <rect width="106" height="50" rx="8" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.2"/>
              {[['#93c5fd',55],['#6ee7b7',38],['#fcd34d',72],['#fca5a5',44]].map(([c,w],i) => (
                <g key={i}>
                  <rect x="8" y={9+i*10} width={w as number} height="7" rx="3" fill={c as string} opacity="0.8"/>
                </g>
              ))}
            </g>

            {/* ─── ISOMETRIC MAP TABLET ─── */}

            {/* Tablet drop shadow */}
            <ellipse cx="320" cy="378" rx="180" ry="16" fill="rgba(0,0,0,0.08)"/>

            {/* Right face */}
            <polygon points="490,98 512,114 512,328 490,312" fill="#b8c2cc"/>
            {/* Bottom face */}
            <polygon points="148,349 490,312 512,328 170,365" fill="#c2ccd4"/>

            {/* Map surface base */}
            <polygon points="148,135 490,98 490,312 148,349" fill="#ede8dc"/>

            {/* All map content, clipped to surface */}
            <g clipPath="url(#mapSurface)">
              {/* Street grid - horizontal (parallel to top/bottom edges) */}
              {[0.18,0.33,0.50,0.66,0.82].map(t => (
                <line key={t}
                  x1="148" y1={135+t*(349-135)}
                  x2="490" y2={98+t*(312-98)}
                  stroke="#e0d8c8" strokeWidth="2.5"/>
              ))}
              {/* Street grid - vertical */}
              {[220,290,360,430].map(x => {
                const topY = 135+(x-148)*(98-135)/(490-148)
                const botY = 349+(x-148)*(312-349)/(490-148)
                return <line key={x} x1={x} y1={topY} x2={x} y2={botY} stroke="#e0d8c8" strokeWidth="2.5"/>
              })}

              {/* Terrain: green (top-left) */}
              <ellipse cx="210" cy="178" rx="55" ry="32" fill="#b8d4a0" opacity="0.7"/>
              {/* Terrain: tan/orange (center) */}
              <ellipse cx="330" cy="230" rx="65" ry="42" fill="#d4a87a" opacity="0.65"/>
              {/* Terrain: light green (bottom-right) */}
              <ellipse cx="440" cy="280" rx="42" ry="26" fill="#a8c890" opacity="0.6"/>
              {/* Terrain: blue water (top-right) */}
              <ellipse cx="430" cy="158" rx="32" ry="18" fill="#a8c8d8" opacity="0.6"/>
              {/* Terrain: small patch */}
              <ellipse cx="195" cy="295" rx="28" ry="18" fill="#c8d8a8" opacity="0.55"/>

              {/* Red restricted overlay */}
              <rect x="0" y="0" width="600" height="500" fill="rgba(220,55,55,0.22)"/>
            </g>

            {/* Tablet border */}
            <polygon points="148,135 490,98 490,312 148,349" fill="none" stroke="#c8d0d8" strokeWidth="2"/>

            {/* Tablet rounded corners */}
            <rect x="144" y="131" width="10" height="10" rx="3" fill="#a8b2be"/>
            <rect x="486" y="94" width="10" height="10" rx="3" fill="#a8b2be"/>
            <rect x="486" y="308" width="10" height="10" rx="3" fill="#a8b2be"/>
            <rect x="144" y="345" width="10" height="10" rx="3" fill="#a8b2be"/>

            {/* Location pins on map */}
            {/* Purple pin */}
            <g transform="translate(370,118)">
              <path d="M9 0C4 0 0 4 0 9 0 15.7 9 25 9 25S18 15.7 18 9C18 4 14 0 9 0Z" fill="#9b5fc2"/>
              <circle cx="9" cy="9" r="4" fill="white" opacity="0.9"/>
            </g>
            {/* Red pin */}
            <g transform="translate(428,162)">
              <path d="M9 0C4 0 0 4 0 9 0 15.7 9 25 9 25S18 15.7 18 9C18 4 14 0 9 0Z" fill="#ef4444"/>
              <circle cx="9" cy="9" r="4" fill="white" opacity="0.9"/>
            </g>

            {/* ─── LOCK (on map) ─── */}
            <g transform="translate(268,148)">
              {/* Shackle (steel) */}
              <path d="M19 46 L19 24 C19 6 67 6 67 24 L67 46"
                stroke="#5a6878" strokeWidth="12" strokeLinecap="round" fill="none"/>
              {/* Body (golden) */}
              <rect x="6" y="46" width="74" height="58" rx="11" fill="#c9a432"/>
              {/* Body sheen */}
              <rect x="12" y="52" width="62" height="18" rx="7" fill="rgba(255,255,255,0.22)"/>
              {/* Keyhole circle */}
              <circle cx="43" cy="69" r="9" fill="#8a7020"/>
              {/* Keyhole slot */}
              <rect x="40" y="69" width="6" height="14" rx="3" fill="#8a7020"/>
              {/* Red diagonal stripe */}
              <line x1="-8" y1="-8" x2="98" y2="116"
                stroke="#ef4444" strokeWidth="12" strokeLinecap="round" opacity="0.82"/>
            </g>

            {/* ─── ROBOT CHARACTER ─── */}
            <g transform="translate(35,178)">

              {/* Ground shadow */}
              <ellipse cx="60" cy="183" rx="54" ry="9" fill="rgba(0,0,0,0.09)"/>

              {/* Backpack */}
              <rect x="93" y="72" width="24" height="42" rx="7" fill="#c9a432" stroke="#b8921e" strokeWidth="1.2"/>
              <rect x="93" y="79" width="10" height="5" rx="2" fill="#b8921e"/>
              <rect x="93" y="100" width="10" height="5" rx="2" fill="#b8921e"/>
              <rect x="103" y="81" width="5" height="26" rx="2" fill="#b8921e"/>

              {/* Hat brim */}
              <ellipse cx="60" cy="30" rx="52" ry="10" fill="#b8921e"/>
              {/* Hat crown */}
              <path d="M14 30 C12 2 108 2 106 30" fill="#c9a432"/>
              {/* Hat band */}
              <rect x="14" y="22" width="92" height="11" rx="3" fill="#a07820"/>
              {/* Goggle on hat */}
              <circle cx="60" cy="29" r="11" fill="#1e1e2e" stroke="#555" strokeWidth="1.5"/>
              <circle cx="60" cy="29" r="7" fill="#0ea5e9" opacity="0.65"/>
              <circle cx="56" cy="26" r="2.5" fill="white" opacity="0.55"/>

              {/* MAIN BODY — round oval shape */}
              <ellipse cx="60" cy="116" rx="44" ry="56" fill="#dce8f2" stroke="#c8d8e8" strokeWidth="1.5"/>
              {/* Body shine highlight */}
              <ellipse cx="46" cy="92" rx="18" ry="14" fill="white" opacity="0.35"/>

              {/* Face area (upper body) */}
              {/* Eyes — round, white with colored iris */}
              <circle cx="42" cy="96" r="10" fill="white" stroke="#b8c8d8" strokeWidth="1.2"/>
              <circle cx="78" cy="96" r="10" fill="white" stroke="#b8c8d8" strokeWidth="1.2"/>
              <circle cx="42" cy="98" r="6" fill="#3a7fd4"/>
              <circle cx="78" cy="98" r="6" fill="#3a7fd4"/>
              <circle cx="40" cy="95" r="2.5" fill="white" opacity="0.8"/>
              <circle cx="76" cy="95" r="2.5" fill="white" opacity="0.8"/>
              {/* Sad eyebrows */}
              <path d="M33 85 Q42 80 51 84" stroke="#7090a0" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              <path d="M69 84 Q78 80 87 85" stroke="#7090a0" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
              {/* Sad mouth */}
              <path d="M38 118 Q60 111 82 118" stroke="#8098a8" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
              {/* Tears */}
              <path d="M40 107 Q38 113 40 120" stroke="#78b8d8" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
              <path d="M80 107 Q78 113 80 120" stroke="#78b8d8" strokeWidth="2.2" fill="none" strokeLinecap="round"/>

              {/* Left arm (holding laptop) */}
              <path d="M18 108 Q2 115 -4 130" stroke="#c8d8e8" strokeWidth="13" strokeLinecap="round" fill="none"/>
              {/* Laptop */}
              <rect x="-20" y="122" width="34" height="26" rx="5" fill="#e4e8ee" stroke="#c8d0d8" strokeWidth="1.2"/>
              <rect x="-18" y="124" width="30" height="20" rx="3" fill="#1e2a3a"/>
              {/* Mini lock on laptop */}
              <path d="M-8 132 L-8 129 C-8 126 2 126 2 129 L2 132" stroke="#ef4444" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
              <rect x="-10" y="132" width="14" height="9" rx="2.5" fill="#ef4444"/>
              {/* Steam from coffee (left arm) */}

              {/* Right arm */}
              <path d="M102 108 Q116 104 118 94" stroke="#c8d8e8" strokeWidth="13" strokeLinecap="round" fill="none"/>

              {/* Legs */}
              <ellipse cx="42" cy="164" rx="14" ry="18" fill="#c8d8e8" stroke="#b8c8d8" strokeWidth="1.2"/>
              <ellipse cx="78" cy="164" rx="14" ry="18" fill="#c8d8e8" stroke="#b8c8d8" strokeWidth="1.2"/>
              {/* Boots */}
              <ellipse cx="38" cy="179" rx="18" ry="7" fill="#8898a8"/>
              <ellipse cx="78" cy="179" rx="18" ry="7" fill="#8898a8"/>
            </g>

            {/* LayersPanel badge */}
            <g transform="translate(82,370)">
              <rect width="100" height="22" rx="6" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.2"
                style={{ filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.1))' }}/>
              <text x="50" y="15" textAnchor="middle" fontSize="11" fill="var(--text-secondary)"
                fontFamily="system-ui, sans-serif" fontWeight="500">LayersPanel</text>
            </g>

            {/* ─── DB Cylinders (bottom-right) ─── */}
            <g transform="translate(380,390)">
              {/* Back cylinder */}
              <ellipse cx="30" cy="8" rx="24" ry="8" fill="#94a3b8"/>
              <rect x="6" y="8" width="48" height="24" fill="#94a3b8"/>
              <ellipse cx="30" cy="32" rx="24" ry="8" fill="#7a8fa0"/>
              {/* Front cylinder */}
              <ellipse cx="18" cy="28" rx="15" ry="5.5" fill="#64748b"/>
              <rect x="3" y="28" width="30" height="16" fill="#64748b"/>
              <ellipse cx="18" cy="44" rx="15" ry="5.5" fill="#4e6070"/>
            </g>

          </svg>
        </div>

        {/* ─── text below illustration ─── */}
        <div style={{
          position:      'relative',
          zIndex:        3,
          textAlign:     'center',
          animation:     'fade-up 0.5s ease both',
          marginTop:     '-10px',
        }}>
          <h1 style={{
            fontSize:'26px', fontWeight:'800', color:'var(--text-primary)',
            margin:'0 0 10px', letterSpacing:'-0.5px', lineHeight:1.25,
          }}>
            {t.title}
          </h1>
          <p style={{
            fontSize:'14px', color:'var(--text-secondary)',
            margin:'0 0 24px', lineHeight:'1.7', maxWidth:'380px',
          }}>
            {t.body}
          </p>
          <button
            onClick={() => navigate('/home')}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent)' }}
            style={{
              display:'inline-flex', alignItems:'center', gap:'8px',
              padding:'10px 22px', background:'var(--accent)', border:'none',
              borderRadius:'var(--radius-md)', fontSize:'13px', fontWeight:'600',
              color:'#fff', cursor:'pointer', transition:'background 0.2s',
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
