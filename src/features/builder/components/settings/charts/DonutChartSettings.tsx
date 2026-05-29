import { useState } from 'react'
import { useTheme } from '../../../../../context/ThemeContext'
import { useBuilderStore } from '../../../store/builderStore'
import { DonutChartConfig } from '../../../types/builder.types'
import SettingsTabs from '../shared/SettingsTabs'
import SettingsSection from '../shared/SettingsSection'
import LayerSelect from '../shared/LayerSelect'
import FieldSelect from '../shared/FieldSelect'
import AggregationSelect from '../shared/AggregationSelect'
import SliderInput from '../shared/SliderInput'
import ToggleSwitch from '../shared/ToggleSwitch'
import { useLayerData } from '../../../hooks/useLayerFields'
import { getCategoryFields, getNumericFields } from '../../../hooks/useAggregatedData'

interface DonutChartSettingsProps {
  widgetId: string
  config: Partial<DonutChartConfig>
}

function DonutChartSettings({ widgetId, config }: DonutChartSettingsProps) {
  const { lang } = useTheme()
  const [activeTab, setActiveTab] = useState('data')

  const layerData = useLayerData(config.layerId ?? '')
  const categoryFields = getCategoryFields(layerData)
  const numericFields = getNumericFields(layerData)

  const tabs = {
    en: [{ id: 'data', label: 'Data' }, { id: 'visual', label: 'Visual' }, { id: 'stats', label: 'Stats' }],
    ar: [{ id: 'data', label: 'البيانات' }, { id: 'visual', label: 'المظهر' }, { id: 'stats', label: 'الإحصاء' }],
  }[lang]

  const t = {
    en: {
      layer: 'Data Layer',
      category: 'Category Field',
      value: 'Value Field',
      holeSize: 'Hole Size',
      labels: 'Show Labels',
      labelsDesc: 'Displays text labels on each slice',
      legend: 'Show Legend',
      legendDesc: 'Shows color legend below the chart',
      labelType: 'Label Type',
      total: 'Show Total in Center',
      totalDesc: 'Displays the sum of all values in the center hole',
      highlight: 'Highlight Largest Slice',
      highlightDesc: 'Visually emphasizes the largest slice',
    },
    ar: {
      layer: 'مصدر البيانات',
      category: 'حقل التصنيف',
      value: 'حقل القيمة',
      holeSize: 'حجم الفراغ المركزي',
      labels: 'إظهار التسميات',
      labelsDesc: 'يعرض نصاً على كل قطاع',
      legend: 'إظهار التفسير',
      legendDesc: 'يعرض مفتاح الألوان',
      labelType: 'نوع التسمية',
      total: 'إظهار المجموع في المركز',
      totalDesc: 'يعرض مجموع القيم في الفراغ المركزي',
      highlight: 'تمييز أكبر قطاع',
      highlightDesc: 'يبرز القطاع الأكبر بصرياً',
    },
  }[lang]

  function updateConfig(patch: Partial<DonutChartConfig>) {
    useBuilderStore.setState(state => ({
      widgets: state.widgets.map(w =>
        w.id === widgetId ? { ...w, config: { ...w.config, ...patch } } : w
      ),
      isSaved: false,
    }))
  }

  const sampleFields = ['category', 'zone', 'type', 'name', 'count', 'area']
  const labelTypes = {
    en: [{ v: 'value', l: 'Value' }, { v: 'percent', l: '%' }, { v: 'name', l: 'Name' }],
    ar: [{ v: 'value', l: 'قيمة' }, { v: 'percent', l: '%' }, { v: 'name', l: 'اسم' }],
  }[lang]

  return (
    <div>
      <SettingsTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'data' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <SettingsSection title={t.layer}>
            <LayerSelect value={config.layerId ?? ''} onChange={v => updateConfig({ layerId: v })} />
          </SettingsSection>
          <SettingsSection title={t.category}>
            <FieldSelect
              label={t.category}
              value={config.categoryField ?? ''}
              layerId={config.layerId ?? ''}
              fields={categoryFields}
              onChange={v => updateConfig({ categoryField: v })}
              placeholder={lang === 'en' ? 'Select field...' : 'اختر حقل...'}
            />
          </SettingsSection>
          <SettingsSection title={t.value}>
            <FieldSelect
              label={t.value}
              value={config.valueField ?? ''}
              layerId={config.layerId ?? ''}
              fields={numericFields}
              onChange={v => updateConfig({ valueField: v })}
              placeholder={lang === 'en' ? 'Select field...' : 'اختر حقل...'}
            />
          </SettingsSection>
          {config.valueField && (
            <SettingsSection title={lang === 'en' ? 'Aggregation' : 'طريقة التجميع'}>
              <AggregationSelect
                value={config.aggregation ?? 'sum'}
                onChange={v => updateConfig({ aggregation: v })}
              />
            </SettingsSection>
          )}
        </div>
      )}

      {activeTab === 'visual' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SliderInput
            label={t.holeSize}
            value={config.holeSize ?? 50}
            min={20} max={80} unit="%"
            onChange={v => updateConfig({ holeSize: v })}
          />
          <div>
            <label style={{
              display: 'block', fontSize: '11px',
              fontWeight: '600', color: 'var(--text-secondary)',
              marginBottom: '6px',
            }}>
              {t.labelType}
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {labelTypes.map(({ v, l }) => (
                <button
                  key={v}
                  onClick={() => updateConfig({ labelType: v as any })}
                  style={{
                    flex: 1, padding: '6px 0',
                    background: (config.labelType ?? 'percent') === v ? 'var(--accent-light)' : 'var(--page-bg)',
                    border: `1px solid ${(config.labelType ?? 'percent') === v ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-md)', fontSize: '11px',
                    color: (config.labelType ?? 'percent') === v ? 'var(--accent)' : 'var(--text-secondary)',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <ToggleSwitch label={t.labels} value={config.showLabels ?? true} onChange={v => updateConfig({ showLabels: v })} description={t.labelsDesc} />
          <ToggleSwitch label={t.legend} value={config.showLegend ?? true} onChange={v => updateConfig({ showLegend: v })} description={t.legendDesc} />
        </div>
      )}

      {activeTab === 'stats' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ToggleSwitch label={t.total} value={config.showTotal ?? true} onChange={v => updateConfig({ showTotal: v })} description={t.totalDesc} />
          <ToggleSwitch label={t.highlight} value={config.highlightLargest ?? false} onChange={v => updateConfig({ highlightLargest: v })} description={t.highlightDesc} />
        </div>
      )}
    </div>
  )
}

export default DonutChartSettings