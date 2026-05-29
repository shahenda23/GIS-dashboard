import { useLayerFields } from "../../../hooks/useLayerFields"

interface FieldSelectProps {
  label: string
  value: string
  layerId: string
  onChange: (value: string) => void
  fields?: string[]
  placeholder?: string
}

function FieldSelect({ label, value, layerId, onChange, fields, placeholder }: FieldSelectProps) {
  const layerFields = useLayerFields(layerId)
  const availableFields = fields ?? layerFields

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
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: '100%',
          padding: '7px 10px',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          fontSize: '12px',
          color: value ? 'var(--text-primary)' : 'var(--text-muted)',
          background: 'var(--page-bg)',
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {availableFields.map(f => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>
    </div>
  )
}

export default FieldSelect