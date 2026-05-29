import { Template } from '../types/template.types'
import { useTheme } from '../../../context/ThemeContext'


interface TemplateCardProps {
  template: Template
  onSelect: (id: string) => void
}

const label ={
      en: {
    comingSoon: 'COMING SOON',
  },
  ar: {
    comingSoon: 'قريباً',
  },
}

function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const isAvailable = template.layout === 'blank'
  const { lang } = useTheme()  


  return (
    <div
      onClick={() => isAvailable && onSelect(template.id)}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        cursor: isAvailable ? 'pointer' : 'default',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        opacity: isAvailable ? 1 : 0.6,
        position: 'relative',
      }}
      onMouseEnter={e => {
        if (!isAvailable) return
        e.currentTarget.style.borderColor = 'var(--accent)'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Coming Soon badge */}
      {!isAvailable && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'var(--accent-light)',
          color: 'var(--accent)',
          fontSize: '10px',
          fontWeight: '600',
          padding: '3px 8px',
          borderRadius: '20px',
          border: '1px solid var(--accent)',
          letterSpacing: '0.3px',
          zIndex: 1,
        }}>
          {label[lang].comingSoon}
        </div>
      )}

      {/* Layout Preview */}
      <div style={{
        height: '140px',
        background: '#f8fafc',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}>
        <LayoutPreview layout={template.layout} />
      </div>

      {/* Info */}
<div style={{ padding: '14px 16px' }}>
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px',
  }}>
    <span style={{ fontSize: '16px' }}>{template.icon}</span>
    <p style={{
      fontSize: '14px',
      fontWeight: '600',
      color: 'var(--text-primary)',
    }}>
      {template.name[lang]}
    </p>
  </div>
  <p style={{
    fontSize: '12px',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
  }}>
    {template.description[lang]}
  </p>
</div>
    </div>
  )
}

// ── Layout Previews ──────────────────────────────
function LayoutPreview({ layout }: { layout: Template['layout'] }) {
  const box = (w: string, h: string, color = '#e2e8f0') => (
    <div style={{
      width: w,
      height: h,
      background: color,
      borderRadius: '3px',
      border: '1px solid #cbd5e1',
    }} />
  )

  if (layout === 'blank') {
    return (
      <div style={{
        width: '100%',
        height: '100%',
        border: '2px dashed #cbd5e1',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
        fontSize: '24px',
      }}>
        +
      </div>
    )
  }

  if (layout === 'urban') {
    return (
      <div style={{ display: 'flex', gap: '6px', width: '100%', height: '100%' }}>
        {box('65%', '100%', '#bfdbfe')}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {box('100%', '45%')}
          {box('100%', '55%')}
        </div>
      </div>
    )
  }

  if (layout === 'field') {
    return (
      <div style={{ display: 'flex', gap: '6px', width: '100%', height: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {box('100%', '40%')}
          {box('100%', '60%')}
        </div>
        {box('55%', '100%', '#bfdbfe')}
      </div>
    )
  }

  if (layout === 'environmental') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', height: '100%' }}>
        {box('100%', '50%', '#bfdbfe')}
        <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
          {box('33%', '100%')}
          {box('33%', '100%')}
          {box('34%', '100%')}
        </div>
      </div>
    )
  }

  if (layout === 'infrastructure') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', height: '100%' }}>
        <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
          {box('33%', '100%')}
          {box('33%', '100%')}
          {box('34%', '100%')}
        </div>
        <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
          {box('33%', '100%')}
          {box('33%', '100%')}
          {box('34%', '100%')}
        </div>
      </div>
    )
  }

  return null
}

export default TemplateCard