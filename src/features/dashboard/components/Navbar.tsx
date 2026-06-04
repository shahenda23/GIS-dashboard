import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../context/ThemeContext'
import UserMenu from './UserMenu'
import logoUrl from '../../../assets/logo.svg'

interface NavbarProps {
  activeTab?:      'dashboards' | 'templates'
  onNewDashboard?: () => void
  showNewButton?:  boolean
}

function Navbar({ activeTab = 'dashboards' }: NavbarProps) {
  const navigate = useNavigate()
  const { lang, toggleLang } = useTheme()

  const isRTL = lang === 'ar'

  const tabs = lang === 'en'
    ? [
        { label: 'Dashboards', tab: 'dashboards' as const, to: '/' },
        { label: 'Templates',  tab: 'templates'  as const, to: '/templates' },
        { label: 'Docs',       tab: null,                  to: '/docs' },
      ]
    : [
        { label: 'لوحاتي',  tab: 'dashboards' as const, to: '/' },
        { label: 'القوالب', tab: 'templates'  as const, to: '/templates' },
        { label: 'التوثيق', tab: null,                  to: '/docs' },
      ]

  return (
    <nav style={{
      position:      'sticky',
      top:           0,
      zIndex:        100,
      display:       'flex',
      alignItems:    'stretch',   // both pills same height
      direction:     isRTL ? 'rtl' : 'ltr',
      marginBottom:  '-2px',
      padding:       isRTL ? '0 0 0 16px' : '0 16px 0 0',
      gap:           '10px',
      pointerEvents: 'none',
    }}>

      {/* ══ LEFT — 1/3 ══════════════════════════════════════════════ */}
      <div
        onClick={() => navigate('/')}
        style={{
          flex:           1,            // 1 وحدة = تلت العرض
          display:        'flex',
          flexDirection:  'column',
          justifyContent: 'center',
          background:     '#ffffff',
          borderBottom:   '2px solid #ffffff',
          borderRight:    isRTL ? 'none'                 : '2px solid #ffffff',
          borderLeft:     isRTL ? '2px solid #ffffff'   : 'none',
          borderTop:      'none',
          borderRadius:   isRTL ? '0 0 0 22px' : '0 0 22px 0',
          padding:        '16px 36px',
          cursor:         'pointer',
          pointerEvents:  'auto',
          transition:     'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
        onMouseLeave={e => (e.currentTarget.style.background = '#ffffff')}
      >
        <span style={{
          fontSize:      '10px',
          color:         '#94a3b8',
          letterSpacing: '0.5px',
          marginBottom:  '5px',
          textTransform: 'uppercase',
          fontWeight:    '500',
        }}>
          GIS Platform
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logoUrl} alt="logo"
            style={{ width: '32px', height: '32px', borderRadius: '9px', flexShrink: 0 }} />
          <span style={{
            fontSize:      '17px',
            fontWeight:    '800',
            color:         '#0f172a',
            letterSpacing: '-0.5px',
            whiteSpace:    'nowrap',
          }}>
            GIS Dashboard Builder
          </span>
        </div>
      </div>

      {/* ══ RIGHT — 2/3 ═════════════════════════════════════════════ */}
      <div style={{
        flex:                 2,
        alignSelf:            'center',
        display:              'flex',
        alignItems:           'center',
        justifyContent:       'space-between',
        background:           'rgba(255,255,255,0.5)',
        backdropFilter:       'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border:               '1.5px solid rgba(255,255,255,0.92)',
        borderRadius:         '999px',
        padding:              '8px 14px',
        boxShadow:            '0 4px 18px rgba(0,0,0,0.07)',
        pointerEvents:        'auto',
        gap:                  '4px',
        margin:               '8px 0',
      } as React.CSSProperties}>

        {/* Nav tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {tabs.map(t => (
            <button key={t.label} onClick={() => navigate(t.to)}
              style={{
                padding:      '8px 18px',
                background:   activeTab === t.tab ? 'rgba(0,0,0,0.07)' : 'transparent',
                border:       'none',
                borderRadius: '20px',
                fontSize:     '14px',
                fontWeight:   activeTab === t.tab ? '700' : '500',
                color:        activeTab === t.tab ? '#0f172a' : '#64748b',
                cursor:       'pointer',
                transition:   'color 0.15s, background 0.15s',
                whiteSpace:   'nowrap',
              }}
              onMouseEnter={e => { if (activeTab !== t.tab) { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.background = 'rgba(0,0,0,0.04)' } }}
              onMouseLeave={e => { if (activeTab !== t.tab) { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent' } }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ width: '1px', height: '18px', background: '#e2e8f0', margin: '0 4px', flexShrink: 0 }} />

          <button onClick={toggleLang} title={lang === 'en' ? 'عربي' : 'English'}
            style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: '50%', cursor: 'pointer', color: '#64748b', transition: 'background 0.15s, color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = '#0f172a' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent';       e.currentTarget.style.color = '#64748b' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </button>

          <UserMenu />
        </div>
      </div>

    </nav>
  )
}

export default Navbar
