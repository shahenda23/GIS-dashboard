import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../context/ThemeContext'

interface NavbarProps {
  onNewDashboard?: () => void
  showNewButton?: boolean
}

function Navbar({ onNewDashboard, showNewButton = true }: NavbarProps) {
  const navigate = useNavigate()
  const { lang, toggleLang } = useTheme()

  return (
    <nav style={{
      height: '75px',
      background: 'var(--nav-bg)',
      borderBottom: '1px solid var(--nav-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 50px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>

      {/* Logo */}
      <div
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
        }}
      >
        <div style={{
          width: '35px',
          height: '35px',
          background: 'var(--accent)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '600',
        }}>
          G
        </div>
        <span style={{
          fontSize: '18px',
          fontWeight: '600',
          color: 'var(--text-primary)',
          letterSpacing: '-0.1px',
        }}>
          GIS Dashboard Builder
        </span>
      </div>

      {/* Right */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>

        {/* Language toggle */}
        <button
          onClick={toggleLang}
          title={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            lineHeight: 1,
          }}
          onMouseEnter={e => {
            e.currentTarget.querySelector('svg')!.style.stroke = 'var(--accent)'
          }}
          onMouseLeave={e => {
            e.currentTarget.querySelector('svg')!.style.stroke = 'var(--text-secondary)'
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.15s' }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </button>

      </div>
    </nav>
  )
}

export default Navbar