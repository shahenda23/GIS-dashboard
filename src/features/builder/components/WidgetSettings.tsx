import { useTheme } from '../../../context/ThemeContext'
import { useBuilderStore } from '../store/builderStore'

function WidgetSettings() {
  const { lang } = useTheme()
  const selectedWidgetId = useBuilderStore(s => s.selectedWidgetId)
  const selectedWidget   = useBuilderStore(s => s.widgets.find(w => w.id === s.selectedWidgetId))
  const selectWidget     = useBuilderStore(s => s.selectWidget)
  const removeWidget     = useBuilderStore(s => s.removeWidget)

  const t = {
    en: {
      title: 'Widget Settings',
      noSelection: 'Select a widget to edit its settings',
      widgetTitle: 'Title',
      dataSource: 'Data Source',
      themeColor: 'Theme Color',
      size: 'Size',
      delete: 'Delete Widget',
      placeholder: 'Select a layer...',
      small: 'Small',
      medium: 'Medium',
      large: 'Large',
    },
    ar: {
      title: 'إعدادات الودجت',
      noSelection: 'اختر ودجتاً لتعديل إعداداته',
      widgetTitle: 'العنوان',
      dataSource: 'مصدر البيانات',
      themeColor: 'لون الثيم',
      size: 'الحجم',
      delete: 'حذف الودجت',
      placeholder: 'اختر طبقة...',
      small: 'صغير',
      medium: 'متوسط',
      large: 'كبير',
    },
  }[lang]

  const colors = [
    '#0ea5e9', '#22c55e', '#f59e0b',
    '#ef4444', '#8b5cf6', '#ec4899',
  ]

  return (
    <aside style={{
      width: '260px',
      background: 'var(--surface)',
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      transition: 'transform 0.2s',
    }}>

      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--accent)" strokeWidth="1.5">
          <circle cx="7" cy="7" r="2"/>
          <path d="M7 1v2M7 11v2M1 7h2M11 7h2M3.2 3.2l1.4 1.4M9.4 9.4l1.4 1.4M9.4 4.6L8 6M5.4 8l-1.4 1.4"/>
        </svg>
        <span style={{
          fontSize: '13px',
          fontWeight: '600',
          color: 'var(--text-primary)',
        }}>
          {t.title}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {!selectedWidget ? (

          /* No selection state */
          <div style={{
            textAlign: 'center',
            padding: '40px 16px',
            color: 'var(--text-muted)',
          }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ marginBottom: '10px', opacity: 0.4 }}>
              <rect x="4" y="4" width="12" height="12" rx="2"/>
              <rect x="20" y="4" width="12" height="12" rx="2"/>
              <rect x="4" y="20" width="12" height="12" rx="2"/>
              <rect x="20" y="20" width="12" height="12" rx="2"/>
            </svg>
            <p style={{ fontSize: '12px', lineHeight: '1.6' }}>
              {t.noSelection}
            </p>
          </div>

        ) : (

          /* Settings form */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Title */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}>
                {t.widgetTitle}
              </label>
              <input
                value={selectedWidget.title}
                onChange={e => {
                  useBuilderStore.setState(state => ({
                    widgets: state.widgets.map(w =>
                      w.id === selectedWidgetId
                        ? { ...w, title: e.target.value }
                        : w
                    ),
                    isSaved: false,
                  }))
                }}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  background: 'var(--page-bg)',
                  outline: 'none',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Data Source */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}>
                {t.dataSource}
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  background: 'var(--page-bg)',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="">{t.placeholder}</option>
                {useBuilderStore.getState().layers.map(layer => (
                  <option key={layer.id} value={layer.id}>
                    {layer.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Color */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                {t.themeColor}
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {colors.map(color => (
                  <div
                    key={color}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: color,
                      cursor: 'pointer',
                      border: '2px solid transparent',
                      transition: 'transform 0.15s, border-color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}>
                {t.size}
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { label: t.small,  w: 4 },
                  { label: t.medium, w: 6 },
                  { label: t.large,  w: 12 },
                ].map(size => (
                  <button
                    key={size.label}
                    onClick={() => {
                      useBuilderStore.setState(state => ({
                        widgets: state.widgets.map(w =>
                          w.id === selectedWidgetId ? { ...w, w: size.w } : w
                        ),
                        isSaved: false,
                      }))
                    }}
                    style={{
                      flex: 1,
                      padding: '6px 0',
                      background: selectedWidget.w === size.w ? 'var(--accent-light)' : 'var(--page-bg)',
                      border: `1px solid ${selectedWidget.w === size.w ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-md)',
                      fontSize: '11px',
                      fontWeight: '500',
                      color: selectedWidget.w === size.w ? 'var(--accent)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--border)' }} />

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--border)' }} />

            {/* Delete */}
            <button
              onClick={() => {
                removeWidget(selectedWidget.id)
                selectWidget(null)
              }}
              style={{
                width: '100%',
                padding: '8px',
                background: 'transparent',
                border: '1px solid #fca5a5',
                borderRadius: 'var(--radius-md)',
                fontSize: '13px',
                fontWeight: '500',
                color: '#ef4444',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {t.delete}
            </button>

          </div>
        )}
      </div>
    </aside>
  )
}

export default WidgetSettings