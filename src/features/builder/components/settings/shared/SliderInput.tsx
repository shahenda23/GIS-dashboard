interface SliderInputProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  unit?: string
  onChange: (value: number) => void
}

function SliderInput({ label, value, min, max, step = 1, unit = '', onChange }: SliderInputProps) {
  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px',
      }}>
        <label style={{
          fontSize: '11px',
          fontWeight: '600',
          color: 'var(--text-secondary)',
        }}>
          {label}
        </label>
        <span style={{
          fontSize: '11px',
          fontWeight: '600',
          color: 'var(--accent)',
          background: 'var(--accent-light)',
          padding: '1px 6px',
          borderRadius: '4px',
        }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          accentColor: 'var(--accent)',
          cursor: 'pointer',
        }}
      />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '10px',
        color: 'var(--text-muted)',
        marginTop: '2px',
      }}>
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  )
}

export default SliderInput