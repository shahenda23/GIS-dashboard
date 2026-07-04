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
        { label: 'Dashboards', tab: 'dashboards' as const, to: '/home' },
        { label: 'Templates',  tab: 'templates'  as const, to: '/templates' },
        { label: 'Docs',       tab: null,                  to: '/docs' },
      ]
    : [
        { label: 'لوحاتي',  tab: 'dashboards' as const, to: '/home' },
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
      padding:       '8px 16px',
      gap:           '10px',
      pointerEvents: 'none',
    }}>

      {/* ══ LEFT — pill brand ═══════════════════════════════════════ */}
      <div
        onClick={() => navigate('/home')}
        style={{
          alignSelf:            'center',
          display:              'flex',
          alignItems:           'center',
          gap:                  '18px',
          background:           'rgba(255,255,255,0.88)',
          backdropFilter:       'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border:               '1.5px solid rgba(255,255,255,0.92)',
          borderRadius:         '999px',
          padding:              '8px 20px 8px 8px',
          boxShadow:            '0 4px 18px rgba(0,0,0,0.07)',
          cursor:               'pointer',
          pointerEvents:        'auto',
          transition:           'box-shadow 0.15s',
          whiteSpace:           'nowrap',
        } as React.CSSProperties}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.11)')}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 18px rgba(0,0,0,0.07)')}
      >
        {/* Logo */}
        <div style={{
          width:          '36px',
          height:         '36px',
          borderRadius:   '50%',
          background:     '#f1f5f9',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          flexShrink:     0,
          overflow:       'hidden',
        }}>
          <img src={logoUrl} alt="logo" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
        </div>

        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>

          <span style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '-0.2px', lineHeight: 1.3 }}>
            <span style={{ color: '#0f172a' }}>Dash</span>
            <span style={{ color: '#0ea5e9' }}>Builder</span>
          </span>
        </div>
      </div>

      {/* ══ RIGHT — 2/3 ═════════════════════════════════════════════ */}
      <div style={{
        flex:                 3,
        alignSelf:            'center',
        position:             'relative',
        display:              'flex',
        alignItems:           'center',
        justifyContent:       'flex-end',
        // direction:            'ltr',
        background:           'rgba(255,255,255,0.5)',
        backdropFilter:       'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border:               '1.5px solid rgba(255,255,255,0.92)',
        borderRadius:         '999px',
        padding:              '8px 14px',
        boxShadow:            '0 4px 18px rgba(0,0,0,0.07)',
        pointerEvents:        'auto',
        margin:               '8px 0',
      } as React.CSSProperties}>

        {/* Nav tabs — always centered */}
        <div style={{
          position:  'absolute',
          left:      '50%',
          transform: 'translateX(-50%)',
          display:   'flex',
          alignItems: 'center',
          gap:        '2px',
        }}>
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

        {/* Actions — always on the right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', zIndex: 1 }}>
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
