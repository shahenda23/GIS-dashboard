import { useState } from 'react'
import { useTheme } from '../../../../../context/ThemeContext'
import { useBuilderStore } from '../../../store/builderStore'
import { FilterConfig } from '../../../types/builder.types'
import SettingsTabs from '../shared/SettingsTabs'
import SettingsSection from '../shared/SettingsSection'
import LayerSelect from '../shared/LayerSelect'
import ToggleSwitch from '../shared/ToggleSwitch'

interface FilterSettingsProps {
  widgetId: string
  config: Partial<FilterConfig>
}

function FilterSettings({ widgetId, config }: FilterSettingsProps) {
  const { lang } = useTheme()
  const widgets = useBuilderStore(s => s.widgets)
  const [activeTab, setActiveTab] = useState('data')

  const tabs = {
    en: [{ id: 'data', label: 'Data' }, { id: 'visual', label: 'Visual' }, { id: 'behavior', label: 'Behavior' }],
    ar: [{ id: 'data', label: 'البيانات' }, { id: 'visual', label: 'المظهر' }, { id: 'behavior', label: 'السلوك' }],
  }[lang]

  const t = {
    en: {
      layer: 'Filter Layer',
      field: 'Filter Field',
      type: 'Filter Type',
      label: 'Filter Label',
      labelPlaceholder: 'e.g. Filter by Zone',
      affects: 'Affects Widgets',
      affectsDesc: 'Select which widgets this filter controls',
      multiple: 'Allow Multiple Selection',
      multipleDesc: 'User can select more than one option',
      types: {
        checkbox: 'Checkbox List',
        dropdown: 'Dropdown',
        range: 'Range Slider',
        date: 'Date Picker',
      },
    },
    ar: {
      layer: 'طبقة الفلتر',
      field: 'حقل الفلتر',
      type: 'نوع الفلتر',
      label: 'عنوان الفلتر',
      labelPlaceholder: 'مثال: تصفية حسب المنطقة',
      affects: 'يؤثر على الودجات',
      affectsDesc: 'اختر الودجات التي يتحكم بها هذا الفلتر',
      multiple: 'السماح بالاختيار المتعدد',
      multipleDesc: 'يمكن للمستخدم اختيار أكثر من خيار',
      types: {
        checkbox: 'قائمة اختيار',
        dropdown: 'قائمة منسدلة',
        range: 'شريط نطاق',
        date: 'منتقي تاريخ',
      },
    },
  }[lang]

  const filterTypes = ['checkbox', 'dropdown', 'range', 'date'] as const
  const sampleFields = ['zone', 'category', 'type', 'status', 'region', 'date']

  function updateConfig(patch: Partial<FilterConfig>) {
    useBuilderStore.setState(state => ({
      widgets: state.widgets.map(w =>
        w.id === widgetId ? { ...w, config: { ...w.config, ...patch } } : w
      ),
      isSaved: false,
    }))
  }

  function toggleAffectsWidget(wid: string) {
    const current = config.affectsWidgets ?? []
    const updated = current.includes(wid)
      ? current.filter(id => id !== wid)
      : [...current, wid]
    updateConfig({ affectsWidgets: updated })
  }

  const otherWidgets = widgets.filter(w => w.id !== widgetId)

  return (
    <div>
      <SettingsTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'data' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <SettingsSection title={t.layer}>
            <LayerSelect
              value={config.layerId ?? ''}
              onChange={v => updateConfig({ layerId: v })}
            />
          </SettingsSection>

          <SettingsSection title={t.field}>
            <select
              value={config.filterField ?? ''}
              onChange={e => updateConfig({ filterField: e.target.value })}
              style={{
                width: '100%', padding: '7px 10px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px', color: 'var(--text-primary)',
                background: 'var(--page-bg)', outline: 'none',
              }}
            >
              <option value="">{lang === 'en' ? 'Select field...' : 'اختر حقل...'}</option>
              {sampleFields.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </SettingsSection>
        </div>
      )}

      {activeTab === 'visual' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block', fontSize: '11px',
              fontWeight: '600', color: 'var(--text-secondary)',
              marginBottom: '5px',
            }}>
              {t.label}
            </label>
            <input
              value={config.label ?? ''}
              onChange={e => updateConfig({ label: e.target.value })}
              placeholder={t.labelPlaceholder}
              style={{
                width: '100%', padding: '7px 10px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px', color: 'var(--text-primary)',
                background: 'var(--page-bg)', outline: 'none',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
            />
          </div>

          <div>
            <label style={{
              display: 'block', fontSize: '11px',
              fontWeight: '600', color: 'var(--text-secondary)',
              marginBottom: '6px',
            }}>
              {t.type}
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {filterTypes.map(ft => (
                <label
                  key={ft}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${(config.filterType ?? 'checkbox') === ft ? 'var(--accent)' : 'var(--border)'}`,
                    background: (config.filterType ?? 'checkbox') === ft ? 'var(--accent-light)' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    transition: 'all 0.15s',
                  }}
                >
                  <input
                    type="radio"
                    name="filterType"
                    value={ft}
                    checked={(config.filterType ?? 'checkbox') === ft}
                    onChange={() => updateConfig({ filterType: ft })}
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  {t.types[ft]}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'behavior' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ToggleSwitch
            label={t.multiple}
            value={config.allowMultiple ?? false}
            onChange={v => updateConfig({ allowMultiple: v })}
            description={t.multipleDesc}
          />

          <div>
            <label style={{
              display: 'block', fontSize: '11px',
              fontWeight: '600', color: 'var(--text-secondary)',
              marginBottom: '4px',
            }}>
              {t.affects}
            </label>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
              {t.affectsDesc}
            </p>
            {otherWidgets.length === 0 ? (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                {lang === 'en' ? 'No other widgets yet' : 'لا توجد ودجات أخرى بعد'}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {otherWidgets.map(w => (
                  <label
                    key={w.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 10px',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${(config.affectsWidgets ?? []).includes(w.id) ? 'var(--accent)' : 'var(--border)'}`,
                      background: (config.affectsWidgets ?? []).includes(w.id) ? 'var(--accent-light)' : 'transparent',
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      transition: 'all 0.15s',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={(config.affectsWidgets ?? []).includes(w.id)}
                      onChange={() => toggleAffectsWidget(w.id)}
                      style={{ accentColor: 'var(--accent)' }}
                    />
                    {w.title}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterSettings