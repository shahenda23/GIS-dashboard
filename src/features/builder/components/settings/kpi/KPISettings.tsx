import { useState } from 'react'
import { useTheme } from '../../../../../context/ThemeContext'
import { useBuilderStore } from '../../../store/builderStore'
import { KPIConfig } from '../../../types/builder.types'
import SettingsTabs from '../shared/SettingsTabs'
import SettingsSection from '../shared/SettingsSection'
import LayerSelect from '../shared/LayerSelect'
import SliderInput from '../shared/SliderInput'
import ToggleSwitch from '../shared/ToggleSwitch'
import NumberInput from '../shared/NumberInput'

interface KPISettingsProps {
  widgetId: string
  config: Partial<KPIConfig>
}

function KPISettings({ widgetId, config }: KPISettingsProps) {
  const { lang } = useTheme()
  const [activeTab, setActiveTab] = useState('data')

  const tabs = {
    en: [{ id: 'data', label: 'Data' }, { id: 'visual', label: 'Visual' }, { id: 'stats', label: 'Stats' }],
    ar: [{ id: 'data', label: 'البيانات' }, { id: 'visual', label: 'المظهر' }, { id: 'stats', label: 'الإحصاء' }],
  }[lang]

  const t = {
    en: {
      layer: 'Data Layer',
      valueField: 'Value Field',
      calculation: 'Calculation',
      label: 'KPI Label',
      unit: 'Unit',
      fontSize: 'Value Font Size',
      trendArrow: 'Show Trend Arrow',
      trendArrowDesc: 'Shows an up/down arrow based on change',
      compareField: 'Compare Against Field',
    },
    ar: {
      layer: 'مصدر البيانات',
      valueField: 'حقل القيمة',
      calculation: 'طريقة الحساب',
      label: 'عنوان المؤشر',
      unit: 'الوحدة',
      fontSize: 'حجم خط القيمة',
      trendArrow: 'إظهار سهم الاتجاه',
      trendArrowDesc: 'يعرض سهماً للأعلى أو الأسفل بناءً على التغيير',
      compareField: 'حقل المقارنة',
    },
  }[lang]

  const calculations = {
    en: [
      { v: 'sum',     l: 'Sum' },
      { v: 'count',   l: 'Count' },
      { v: 'average', l: 'Average' },
      { v: 'max',     l: 'Maximum' },
      { v: 'min',     l: 'Minimum' },
    ],
    ar: [
      { v: 'sum',     l: 'المجموع' },
      { v: 'count',   l: 'العدد' },
      { v: 'average', l: 'المتوسط' },
      { v: 'max',     l: 'الحد الأقصى' },
      { v: 'min',     l: 'الحد الأدنى' },
    ],
  }[lang]

  function updateConfig(patch: Partial<KPIConfig>) {
    useBuilderStore.setState(state => ({
      widgets: state.widgets.map(w =>
        w.id === widgetId ? { ...w, config: { ...w.config, ...patch } } : w
      ),
      isSaved: false,
    }))
  }

  const sampleFields = ['population', 'area', 'count', 'value', 'total', 'score']

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

          <SettingsSection title={t.valueField}>
            <select
              value={config.valueField ?? ''}
              onChange={e => updateConfig({ valueField: e.target.value })}
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

          <SettingsSection title={t.calculation}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {calculations.map(({ v, l }) => (
                <label
                  key={v}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${(config.calculation ?? 'count') === v ? 'var(--accent)' : 'var(--border)'}`,
                    background: (config.calculation ?? 'count') === v ? 'var(--accent-light)' : 'transparent',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    transition: 'all 0.15s',
                  }}
                >
                  <input
                    type="radio"
                    name="calculation"
                    value={v}
                    checked={(config.calculation ?? 'count') === v}
                    onChange={() => updateConfig({ calculation: v as any })}
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  {l}
                </label>
              ))}
            </div>
          </SettingsSection>

          <SettingsSection title={t.compareField}>
            <select
              value={config.compareField ?? ''}
              onChange={e => updateConfig({ compareField: e.target.value })}
              style={{
                width: '100%', padding: '7px 10px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px', color: 'var(--text-primary)',
                background: 'var(--page-bg)', outline: 'none',
              }}
            >
              <option value="">{lang === 'en' ? 'None' : 'بدون مقارنة'}</option>
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
              placeholder={lang === 'en' ? 'e.g. Total Features' : 'مثال: إجمالي المعالم'}
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
              marginBottom: '5px',
            }}>
              {t.unit}
            </label>
            <input
              value={config.unit ?? ''}
              onChange={e => updateConfig({ unit: e.target.value })}
              placeholder={lang === 'en' ? 'e.g. km², ha, %' : 'مثال: كم²، %'}
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

          <SliderInput
            label={t.fontSize}
            value={config.fontSize ?? 36}
            min={20} max={64} unit="px"
            onChange={v => updateConfig({ fontSize: v })}
          />
        </div>
      )}

      {activeTab === 'stats' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ToggleSwitch
            label={t.trendArrow}
            value={config.showTrendArrow ?? true}
            onChange={v => updateConfig({ showTrendArrow: v })}
            description={t.trendArrowDesc}
          />
        </div>
      )}
    </div>
  )
}

export default KPISettings