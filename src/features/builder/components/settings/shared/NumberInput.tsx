interface NumberInputProps {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  unit?: string
  onChange: (value: number) => void
}

function NumberInput({ label, value, min, max, step = 1, unit, onChange }: NumberInputProps) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '11px',
        fontWeight: '600',
        color: 'var(--text-secondary)',
        marginBottom: '5px',
      }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            flex: 1,
            padding: '7px 10px',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '12px',
            color: 'var(--text-primary)',
            background: 'var(--page-bg)',
            outline: 'none',
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
        />
        {unit && (
          <span style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            flexShrink: 0,
          }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}

export default NumberInput