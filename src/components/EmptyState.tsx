interface EmptyStateProps {
  icon: string
  title: string
  body: string
  cta?: string
  onCta?: () => void
}

export function EmptyState({ icon, title, body, cta, onCta }: EmptyStateProps) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div style={{
        width: '80px', height: '80px', borderRadius: '50%',
        background: 'var(--surface)', border: '1px solid var(--border)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '32px',
      }}>
        {icon}
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 6px' }}>{title}</p>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>{body}</p>
      </div>
      {cta && onCta && (
        <button
          onClick={onCta}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'background 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--accent)')}
        >
          {cta}
        </button>
      )}
    </div>
  )
}
