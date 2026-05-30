import logoUrl from '../assets/logo.svg'

function AppLoader() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--page-bg)',
      gap: '20px',
      zIndex: 9999,
    }}>
      <div style={{ position: 'relative', width: '56px', height: '56px' }}>
        {/* Spinning ring */}
        <svg
          width="56" height="56" viewBox="0 0 56 56"
          style={{ position: 'absolute', inset: 0, animation: 'spin 1s linear infinite' }}
        >
          <circle
            cx="28" cy="28" r="24"
            fill="none"
            stroke="var(--border)"
            strokeWidth="3"
          />
          <circle
            cx="28" cy="28" r="24"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="40 110"
          />
        </svg>
        {/* Logo in center */}
        <img
          src={logoUrl}
          alt="logo"
          style={{
            position: 'absolute',
            inset: '10px',
            width: '36px',
            height: '36px',
            borderRadius: '8px',
          }}
        />
      </div>

      <span style={{
        fontSize: '13px',
        color: 'var(--text-muted)',
        fontWeight: '500',
        letterSpacing: '0.2px',
      }}>
        GIS Dashboard Builder
      </span>

    </div>
  )
}

export default AppLoader
