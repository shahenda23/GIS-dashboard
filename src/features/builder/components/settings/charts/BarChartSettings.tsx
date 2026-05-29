import { useState } from 'react'
import { useTheme } from '../../../../../context/ThemeContext'
import { useBuilderStore } from '../../../store/builderStore'
import { BarChartConfig } from '../../../types/builder.types'
import SettingsTabs from '../shared/SettingsTabs'
import SettingsSection from '../shared/SettingsSection'
import LayerSelect from '../shared/LayerSelect'
import ColorPicker from '../shared/ColorPicker'
import SliderInput from '../shared/SliderInput'
import ToggleSwitch from '../shared/ToggleSwitch'
import FieldSelect from '../shared/FieldSelect'
import AggregationSelect from '../shared/AggregationSelect'
import { useLayerData, useLayerFields } from '../../../hooks/useLayerFields'
import { getCategoryFields, getNumericFields } from '../../../hooks/useAggregatedData'


interface BarChartSettingsProps {
  widgetId: string
  config: Partial<BarChartConfig>
}

function BarChartSettings({ widgetId, config }: BarChartSettingsProps) {
  const { lang } = useTheme()
  const [activeTab, setActiveTab] = useState('data')

  const layerData = useLayerData(config.layerId ?? '')
  const categoryFields = getCategoryFields(layerData)
  const numericFields  = getNumericFields(layerData)

  const tabs = {
    en: [
      { id: 'data',   label: 'Data' },
      { id: 'visual', label: 'Visual' },
      { id: 'stats',  label: 'Stats' },
    ],
    ar: [
      { id: 'data',   label: 'البيانات' },
      { id: 'visual', label: 'المظهر' },
      { id: 'stats',  label: 'الإحصاء' },
    ],
  }[lang]

  const t = { 
    en: {
      layer: 'Data Layer',
      xField: 'X Axis Field',
      yField: 'Y Axis Field',
      aggregation: 'Aggregation',
      color: 'Bar Color',
      radius: 'Bar Corner Radius',
      gridLines: 'Show Grid Lines',
      legend: 'Show Legend',
      labelSize: 'Label Font Size',
      sortOrder: 'Sort Bars',
      sortNone: 'None',
      sortAsc: 'Ascending',
      sortDesc: 'Descending',
      avgLine: 'Show Average Line',
      avgLineDesc: 'Draws a horizontal line at the average value',
      maxLabel: 'Highlight Max Value',
      maxLabelDesc: 'Adds a label on the highest bar',
    },
    ar: {
      layer: 'مصدر البيانات',
      xField: 'حقل المحور الأفقي',
      yField: 'حقل المحور الرأسي',
      aggregation: 'طريقة التجميع',
      color: 'لون الأعمدة',
      radius: 'انحناء زوايا الأعمدة',
      gridLines: 'إظهار خطوط الشبكة',
      legend: 'إظهار التفسير',
      labelSize: 'حجم خط التسمية',
      sortOrder: 'ترتيب الأعمدة',
      sortNone: 'بدون ترتيب',
      sortAsc: 'تصاعدي',
      sortDesc: 'تنازلي',
      avgLine: 'إظهار خط المتوسط',
      avgLineDesc: 'يرسم خطاً أفقياً عند قيمة المتوسط',
      maxLabel: 'تمييز أعلى قيمة',
      maxLabelDesc: 'يضيف تسمية على أعلى عمود',
    },
  }[lang]

  function updateConfig(patch: Partial<BarChartConfig>) {
    useBuilderStore.setState(state => ({
      widgets: state.widgets.map(w =>
        w.id === widgetId
          ? { ...w, config: { ...w.config, ...patch } }
          : w
      ),
      isSaved: false,
    }))
  }

  const sampleFields = ['name', 'value', 'category', 'count', 'area', 'population']

  return (
    <div>
      <SettingsTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* DATA TAB */}
      {activeTab === 'data' && (
        <div>
          <SettingsSection title={t.layer}>
            <LayerSelect
              value={config.layerId ?? ''}
              onChange={v => updateConfig({ layerId: v })}
            />
          </SettingsSection>

          <SettingsSection title={t.xField}>
            
            <FieldSelect
            label={t.xField}
            value={config.xField ?? ''}
            layerId={config.layerId ?? ''}
            fields={categoryFields}      // ← بس الـ category fields
            onChange={v => updateConfig({ xField: v })}
            />
          </SettingsSection>

          <SettingsSection title={t.yField}>
            <FieldSelect
              label={t.yField}
              value={config.yField ?? ''}
              layerId={config.layerId ?? ''}
              fields={numericFields}
              onChange={v => updateConfig({ yField: v })}
            />
          </SettingsSection>

          {config.yField && (
            <SettingsSection title={t.aggregation}>
              <AggregationSelect
                value={config.aggregation ?? 'sum'}
                onChange={v => updateConfig({ aggregation: v })}
              />
            </SettingsSection>
          )}
        </div>
      )}

      {/* VISUAL TAB */}
      {activeTab === 'visual' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ColorPicker
            label={t.color}
            value={config.color ?? '#0ea5e9'}
            onChange={v => updateConfig({ color: v })}
          />
          <SliderInput
            label={t.radius}
            value={config.barRadius ?? 4}
            min={0}
            max={16}
            unit="px"
            onChange={v => updateConfig({ barRadius: v })}
          />
          <SliderInput
            label={t.labelSize}
            value={config.labelSize ?? 11}
            min={8}
            max={18}
            unit="px"
            onChange={v => updateConfig({ labelSize: v })}
          />
          <ToggleSwitch
            label={t.gridLines}
            value={config.showGridLines ?? true}
            onChange={v => updateConfig({ showGridLines: v })}
          />
          <ToggleSwitch
            label={t.legend}
            value={config.showLegend ?? false}
            onChange={v => updateConfig({ showLegend: v })}
          />
          <div>
            <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              marginBottom: '6px',
            }}>
              {t.sortOrder}
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['none', 'asc', 'desc'] as const).map((s, i) => (
                <button
                  key={s}
                  onClick={() => updateConfig({ sortOrder: s })}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    background: (config.sortOrder ?? 'none') === s
                      ? 'var(--accent-light)'
                      : 'var(--page-bg)',
                    border: `1px solid ${(config.sortOrder ?? 'none') === s
                      ? 'var(--accent)'
                      : 'var(--border)'}`,
                    borderRadius: 'var(--radius-md)',
                    fontSize: '11px',
                    color: (config.sortOrder ?? 'none') === s
                      ? 'var(--accent)'
                      : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {[t.sortNone, t.sortAsc, t.sortDesc][i]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STATS TAB */}
      {activeTab === 'stats' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ToggleSwitch
            label={t.avgLine}
            value={config.showAverage ?? false}
            onChange={v => updateConfig({ showAverage: v })}
            description={t.avgLineDesc}
          />
          <ToggleSwitch
            label={t.maxLabel}
            value={config.showMaxLabel ?? false}
            onChange={v => updateConfig({ showMaxLabel: v })}
            description={t.maxLabelDesc}
          />
        </div>
      )}
    </div>
  )
}

export default BarChartSettings