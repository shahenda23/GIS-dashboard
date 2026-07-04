import logoUrl from '../../../assets/logo.svg'

interface ViewTopBarLabels {
  edit: string
  share: string
  previewMode: string
}

interface ViewTopBarProps {
  title: string
  isPreview: boolean
  dashboardId: string
  isOwner: boolean
  labels: ViewTopBarLabels
  lang: string
  toggleLang: () => void
  navigate: (to: string) => void
  onShare: () => void
}

export function ViewTopBar({
  title, isPreview, dashboardId, isOwner,
  labels, lang, toggleLang, navigate, onShare,
}: ViewTopBarProps) {
  return (
    <header style={{
      height: '70px', flexShrink: 0, width: '100%', boxSizing: 'border-box',
      background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', padding: '0 40px', gap: '12px',
      position: 'sticky', top: 0, zIndex: 200,
    }}>

      {/* ── Left: logo + divider + title ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>

        <img src={logoUrl} alt="logo" style={{ width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0 }} />

        <div style={{ width: '1px', height: '18px', background: 'var(--border)', flexShrink: 0 }} />

        <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {title}
        </span>

        {isPreview && (
          <span style={{ fontSize: '10px', fontWeight: '700', color: '#d97706', background: 'rgba(254,243,199,0.9)', border: '1px solid rgba(253,230,138,0.8)', borderRadius: '20px', padding: '2px 8px', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {labels.previewMode}
          </span>
        )}
      </div>

      {/* ── Right: lang + share + edit ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>

        <button
          onClick={toggleLang}
          title={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
          style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'background 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--page-bg)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
        </button>

        {isOwner && (
          <button
            onClick={onShare}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--page-bg)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="11" cy="3" r="1.5"/><circle cx="3" cy="7" r="1.5"/><circle cx="11" cy="11" r="1.5"/>
              <path d="M4.5 6.5l5-2.5M4.5 7.5l5 2.5"/>
            </svg>
            {labels.share}
          </button>
        )}

        {isOwner && (
          <button
            onClick={() => navigate(`/builder/${dashboardId}`)}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 14px', background: 'var(--accent)', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#fff', cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
          >
            <svg width="12" height="12" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 2l2 2-6 6H3V8l6-6z"/>
            </svg>
            {labels.edit}
          </button>
        )}
      </div>
    </header>
  )
}
