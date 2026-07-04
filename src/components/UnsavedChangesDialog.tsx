import { useTheme } from '../context/ThemeContext'

interface Props {
  onSave:   () => void | Promise<void>
  onIgnore: () => void
  onCancel: () => void
}

export default function UnsavedChangesDialog({ onSave, onIgnore, onCancel }: Props) {
  const { lang } = useTheme()

  return (
    <div
      onClick={onCancel}
      style={{
        position:        'fixed',
        inset:           0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        zIndex:          9999,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--surface)',
          borderRadius:    '16px',
          padding:         '32px',
          width:           '400px',
          boxShadow:       '0 24px 64px rgba(0,0,0,0.2)',
        }}
      >
        <h2 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {lang === 'ar' ? 'تغييرات غير محفوظة' : 'Unsaved Changes'}
        </h2>
        <p style={{ margin: '0 0 24px', color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.6 }}>
          {lang === 'ar'
            ? 'لديك تغييرات غير محفوظة. إذا خرجت الآن ستُفقد جميع التغييرات.'
            : 'You have unsaved changes. If you leave now, all your changes will be lost.'}
        </p>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onSave}
            style={{
              flex: 1, padding: '10px',
              background: 'var(--accent)', border: 'none',
              borderRadius: '8px', cursor: 'pointer',
              fontSize: '13px', color: '#fff', fontWeight: 600,
            }}
          >
            {lang === 'ar' ? 'حفظ' : 'Save'}
          </button>
          <button
            onClick={onIgnore}
            style={{
              flex: 1, padding: '10px',
              background: 'transparent', border: '1px solid #fca5a5',
              borderRadius: '8px', cursor: 'pointer',
              fontSize: '13px', color: '#ef4444', fontWeight: 500,
            }}
          >
            {lang === 'ar' ? 'تجاهل' : 'Ignore'}
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '10px',
              background: 'transparent', border: '1px solid var(--border)',
              borderRadius: '8px', cursor: 'pointer',
              fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500,
            }}
          >
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  )
}
