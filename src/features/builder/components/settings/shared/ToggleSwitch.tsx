interface ToggleSwitchProps {
  label: string
  value: boolean
  onChange: (value: boolean) => void
  description?: string
}

function ToggleSwitch({ label, value, onChange, description }: ToggleSwitchProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '12px',
    }}>
      <div>
        <p style={{
          fontSize: '12px',
          fontWeight: '500',
          color: 'var(--text-primary)',
          marginBottom: description ? '2px' : '0',
        }}>
          {label}
        </p>
        {description && (
          <p style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            lineHeight: '1.4',
          }}>
            {description}
          </p>
        )}
      </div>

      <div
        onClick={() => onChange(!value)}
        style={{
          width: '36px',
          height: '20px',
          background: value ? 'var(--accent)' : 'var(--border-strong)',
          borderRadius: '20px',
          cursor: 'pointer',
          position: 'relative',
          transition: 'background 0.2s',
          flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute',
          top: '3px',
          left: value ? '19px' : '3px',
          width: '14px',
          height: '14px',
          background: '#fff',
          borderRadius: '50%',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </div>
    </div>
  )
}

export default ToggleSwitch