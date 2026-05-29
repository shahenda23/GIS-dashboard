import { useState } from 'react'
import { useTheme } from '../../../../context/ThemeContext'

function FilterWidget() {
  const { lang } = useTheme()
  const [selected, setSelected] = useState<string[]>([])

  const options = ['Zone A', 'Zone B', 'Zone C', 'Zone D']

  const t = {
    en: { title: 'Filter by Zone', all: 'All Zones', apply: 'Apply Filter' },
    ar: { title: 'تصفية حسب المنطقة', all: 'كل المناطق', apply: 'تطبيق الفلتر' },
  }[lang]

  function toggle(opt: string) {
    setSelected(prev =>
      prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
    )
  }

  return (
    <div style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {t.title}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {options.map(opt => (
          <label
            key={opt}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 8px',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              background: selected.includes(opt) ? 'var(--accent-light)' : 'transparent',
              transition: 'background 0.15s',
            }}
          >
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => toggle(opt)}
              style={{ accentColor: 'var(--accent)', width: '14px', height: '14px' }}
            />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
              {opt}
            </span>
          </label>
        ))}
      </div>

      <button
        style={{
          marginTop: 'auto',
          padding: '8px',
          background: 'var(--accent)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: '12px',
          fontWeight: '500',
          cursor: 'pointer',
        }}
      >
        {t.apply}
      </button>
    </div>
  )
}

export default FilterWidget