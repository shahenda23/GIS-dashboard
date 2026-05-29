import { AggregationType } from '../../../hooks/useAggregatedData'
import { useTheme } from '../../../../../context/ThemeContext'

interface AggregationSelectProps {
  value: AggregationType
  onChange: (v: AggregationType) => void
  disabled?: boolean
}

function AggregationSelect({ value, onChange, disabled }: AggregationSelectProps) {
  const { lang } = useTheme()

  const options = {
    en: [
      { v: 'sum',   l: 'Sum',     desc: 'Total of all values' },
      { v: 'avg',   l: 'Average', desc: 'Mean of all values' },
      { v: 'min',   l: 'Min',     desc: 'Lowest value' },
      { v: 'max',   l: 'Max',     desc: 'Highest value' },
      { v: 'count', l: 'Count',   desc: 'Number of records' },
    ],
    ar: [
      { v: 'sum',   l: 'المجموع',  desc: 'مجموع كل القيم' },
      { v: 'avg',   l: 'المتوسط',  desc: 'متوسط القيم' },
      { v: 'min',   l: 'الأدنى',   desc: 'أقل قيمة' },
      { v: 'max',   l: 'الأعلى',   desc: 'أعلى قيمة' },
      { v: 'count', l: 'العدد',    desc: 'عدد السجلات' },
    ],
  }[lang]

  const label = { en: 'Aggregation', ar: 'طريقة التجميع' }[lang]

  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '11px',
        fontWeight: '600',
        color: 'var(--text-secondary)',
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        {label}
      </label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {options.map(opt => (
          <label
            key={opt.v}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 10px',
              borderRadius: 'var(--radius-md)',
              border: `1px solid ${value === opt.v ? 'var(--accent)' : 'var(--border)'}`,
              background: value === opt.v ? 'var(--accent-light)' : 'transparent',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
              transition: 'all 0.15s',
            }}
          >
            <input
              type="radio"
              name="aggregation"
              value={opt.v}
              checked={value === opt.v}
              disabled={disabled}
              onChange={() => onChange(opt.v as AggregationType)}
              style={{ accentColor: 'var(--accent)' }}
            />
            <div>
              <p style={{
                fontSize: '12px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                margin: 0,
              }}>
                {opt.l}
              </p>
              <p style={{
                fontSize: '10px',
                color: 'var(--text-muted)',
                margin: 0,
              }}>
                {opt.desc}
              </p>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

export default AggregationSelect