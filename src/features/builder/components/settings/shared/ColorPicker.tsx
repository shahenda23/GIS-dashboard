interface ColorPickerProps {
  label?: string
  value: string
  onChange: (color: string) => void
  presets?: string[]
}

const DEFAULT_PRESETS = [
  '#0ea5e9', '#22c55e', '#f59e0b',
  '#ef4444', '#8b5cf6', '#ec4899',
  '#14b8a6', '#f97316', '#6366f1',
]

function ColorPicker({ label, value, onChange, presets = DEFAULT_PRESETS }: ColorPickerProps) {
  return (
    <div>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '11px',
          fontWeight: '600',
          color: 'var(--text-secondary)',
          marginBottom: '8px',
        }}>
          {label}
        </label>
      )}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
        {presets.map(color => (
          <div
            key={color}
            onClick={() => onChange(color)}
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: color,
              cursor: 'pointer',
              border: value === color
                ? `3px solid var(--text-primary)`
                : '2px solid transparent',
              transition: 'transform 0.15s, border 0.15s',
              flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        ))}

        {/* Custom color input */}
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            border: '2px solid var(--border)',
            cursor: 'pointer',
            padding: '0',
            background: 'transparent',
          }}
          title="Custom color"
        />
      </div>
    </div>
  )
}

export default ColorPicker