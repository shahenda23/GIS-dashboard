import { useState } from 'react'
import { useTheme } from '../../../../../context/ThemeContext'
import { useBuilderStore } from '../../../store/builderStore'
import { TableConfig } from '../../../types/builder.types'
import SettingsTabs from '../shared/SettingsTabs'
import SettingsSection from '../shared/SettingsSection'
import LayerSelect from '../shared/LayerSelect'
import SliderInput from '../shared/SliderInput'
import ToggleSwitch from '../shared/ToggleSwitch'
import NumberInput from '../shared/NumberInput'

interface TableSettingsProps {
  widgetId: string
  config: Partial<TableConfig>
}

function TableSettings({ widgetId, config }: TableSettingsProps) {
  const { lang } = useTheme()
  const [activeTab, setActiveTab] = useState('data')

  const tabs = {
    en: [{ id: 'data', label: 'Data' }, { id: 'visual', label: 'Visual' }, { id: 'behavior', label: 'Behavior' }],
    ar: [{ id: 'data', label: 'البيانات' }, { id: 'visual', label: 'المظهر' }, { id: 'behavior', label: 'السلوك' }],
  }[lang]

  const t = {
    en: {
      layer: 'Data Layer',
      maxRows: 'Max Rows',
      rowHeight: 'Row Height',
      compact: 'Compact',
      normal: 'Normal',
      comfortable: 'Comfortable',
      fontSize: 'Font Size',
      rowNumbers: 'Show Row Numbers',
      rowNumbersDesc: 'Adds a number column at the start',
      stripeRows: 'Stripe Rows',
      stripeRowsDesc: 'Alternates row background colors',
      sorting: 'Allow Sorting',
      sortingDesc: 'User can click column headers to sort',
      search: 'Allow Search',
      searchDesc: 'Shows a search box above the table',
    },
    ar: {
      layer: 'مصدر البيانات',
      maxRows: 'أقصى عدد صفوف',
      rowHeight: 'ارتفاع الصف',
      compact: 'مضغوط',
      normal: 'عادي',
      comfortable: 'مريح',
      fontSize: 'حجم الخط',
      rowNumbers: 'إظهار أرقام الصفوف',
      rowNumbersDesc: 'يضيف عموداً بأرقام الصفوف',
      stripeRows: 'تلوين متناوب',
      stripeRowsDesc: 'يتناوب لون خلفية الصفوف',
      sorting: 'السماح بالترتيب',
      sortingDesc: 'يمكن للمستخدم الضغط على رأس العمود للترتيب',
      search: 'السماح بالبحث',
      searchDesc: 'يعرض مربع بحث فوق الجدول',
    },
  }[lang]

  const rowHeights = [
    { v: 'compact',     l: t.compact },
    { v: 'normal',      l: t.normal },
    { v: 'comfortable', l: t.comfortable },
  ]

  function updateConfig(patch: Partial<TableConfig>) {
    useBuilderStore.setState(state => ({
      widgets: state.widgets.map(w =>
        w.id === widgetId ? { ...w, config: { ...w.config, ...patch } } : w
      ),
      isSaved: false,
    }))
  }

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
          <SettingsSection title={t.maxRows}>
            <NumberInput
              label=""
              value={config.maxRows ?? 10}
              min={5} max={100} step={5}
              onChange={v => updateConfig({ maxRows: v })}
            />
          </SettingsSection>
        </div>
      )}

      {activeTab === 'visual' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block', fontSize: '11px',
              fontWeight: '600', color: 'var(--text-secondary)',
              marginBottom: '6px',
            }}>
              {t.rowHeight}
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {rowHeights.map(({ v, l }) => (
                <button
                  key={v}
                  onClick={() => updateConfig({ rowHeight: v as any })}
                  style={{
                    flex: 1, padding: '6px 0',
                    background: (config.rowHeight ?? 'normal') === v ? 'var(--accent-light)' : 'var(--page-bg)',
                    border: `1px solid ${(config.rowHeight ?? 'normal') === v ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-md)', fontSize: '11px',
                    color: (config.rowHeight ?? 'normal') === v ? 'var(--accent)' : 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <SliderInput
            label={t.fontSize}
            value={config.fontSize ?? 12}
            min={10} max={16} unit="px"
            onChange={v => updateConfig({ fontSize: v })}
          />
          <ToggleSwitch
            label={t.rowNumbers}
            value={config.showRowNumbers ?? false}
            onChange={v => updateConfig({ showRowNumbers: v })}
            description={t.rowNumbersDesc}
          />
          <ToggleSwitch
            label={t.stripeRows}
            value={config.stripeRows ?? true}
            onChange={v => updateConfig({ stripeRows: v })}
            description={t.stripeRowsDesc}
          />
        </div>
      )}

      {activeTab === 'behavior' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ToggleSwitch
            label={t.sorting}
            value={config.allowSorting ?? true}
            onChange={v => updateConfig({ allowSorting: v })}
            description={t.sortingDesc}
          />
          <ToggleSwitch
            label={t.search}
            value={config.allowSearch ?? false}
            onChange={v => updateConfig({ allowSearch: v })}
            description={t.searchDesc}
          />
        </div>
      )}
    </div>
  )
}

export default TableSettings