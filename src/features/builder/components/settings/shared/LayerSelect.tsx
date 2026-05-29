import { useBuilderStore } from '../../../store/builderStore'
import { useTheme } from '../../../../../context/ThemeContext'

interface LayerSelectProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

function LayerSelect({ value, onChange, label }: LayerSelectProps) {
  const { layers } = useBuilderStore()
  const { lang } = useTheme()

  const placeholder = lang === 'en' ? 'Select a layer...' : 'اختر طبقة...'

  return (
    <div>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '11px',
          fontWeight: '600',
          color: 'var(--text-secondary)',
          marginBottom: '5px',
        }}>
          {label}
        </label>
      )}
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
        <option value="">{placeholder}</option>
        {layers.map(l => (
          <option key={l.id} value={l.id}>
            {l.name} ({l.type.toUpperCase()})
          </option>
        ))}
      </select>
    </div>
  )
}

export default LayerSelect