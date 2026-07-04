interface PreviewBannerProps {
  text: string
  editLabel: string
  onEdit: () => void
}

export function PreviewBanner({ text, editLabel, onEdit }: PreviewBannerProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '0 12px 8px', flexShrink: 0 }}>
      <div style={{
        display:              'flex',
        alignItems:           'center',
        gap:                  '8px',
        background:           'rgba(254,243,199,0.92)',
        backdropFilter:       'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border:               '1px solid rgba(253,230,138,0.85)',
        borderRadius:         '40px',
        padding:              '6px 16px',
        boxShadow:            '0 2px 12px rgba(217,119,6,0.12)',
      } as React.CSSProperties}>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="#d97706" strokeWidth="1.6">
          <circle cx="7" cy="7" r="6"/>
          <line x1="7" y1="4" x2="7" y2="7.5"/>
          <circle cx="7" cy="10" r="0.5" fill="#d97706"/>
        </svg>
        <span style={{ fontSize: '12px', color: '#92400e', fontWeight: '500' }}>{text}</span>
        <button
          onClick={onEdit}
          style={{ fontSize: '11px', fontWeight: '700', color: '#b45309', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline', marginLeft: '4px' }}
        >
          {editLabel}
        </button>
      </div>
    </div>
  )
}
