import { useState } from 'react'
import { useTheme } from '../../../../../context/ThemeContext'
import { useBuilderStore } from '../../../store/builderStore'
import { ScatterChartConfig } from '../../../types/builder.types'
import SettingsTabs from '../shared/SettingsTabs'
import SettingsSection from '../shared/SettingsSection'
import LayerSelect from '../shared/LayerSelect'
import FieldSelect from '../shared/FieldSelect'
import AggregationSelect from '../shared/AggregationSelect'
import ColorPicker from '../shared/ColorPicker'
import SliderInput from '../shared/SliderInput'
import ToggleSwitch from '../shared/ToggleSwitch'
import { useLayerData } from '../../../hooks/useLayerFields'
import { getNumericFields } from '../../../hooks/useAggregatedData'

interface ScatterChartSettingsProps {
  widgetId: string
  config: Partial<ScatterChartConfig>
}

function ScatterChartSettings({ widgetId, config }: ScatterChartSettingsProps) {
  const { lang } = useTheme()
  const [activeTab, setActiveTab] = useState('data')

  const layerData = useLayerData(config.layerId ?? '')
  const numericFields = getNumericFields(layerData)

  const tabs = {
    en: [{ id: 'data', label: 'Data' }, { id: 'visual', label: 'Visual' }, { id: 'stats', label: 'Stats' }],
    ar: [{ id: 'data', label: 'البيانات' }, { id: 'visual', label: 'المظهر' }, { id: 'stats', label: 'الإحصاء' }],
  }[lang]

  const t = {
    en: {
      layer: 'Data Layer',
      xField: 'X Axis Field',
      yField: 'Y Axis Field',
      color: 'Point Color',
      pointSize: 'Point Size',
      pointOpacity: 'Point Opacity',
      regression: 'Show Regression Line',
      regressionDesc: 'Adds a linear trend line through the points',
      correlation: 'Show Correlation Coefficient',
      correlationDesc: 'Displays R² value on the chart',
      quadrants: 'Show Quadrant Lines',
      quadrantsDesc: 'Divides the chart into 4 quadrants',
    },
    ar: {
      layer: 'مصدر البيانات',
      xField: 'حقل المحور الأفقي',
      yField: 'حقل المحور الرأسي',
      color: 'لون النقاط',
      pointSize: 'حجم النقطة',
      pointOpacity: 'شفافية النقاط',
      regression: 'خط الانحدار',
      regressionDesc: 'يضيف خط اتجاه خطي عبر النقاط',
      correlation: 'معامل الارتباط',
      correlationDesc: 'يعرض قيمة R² على المخطط',
      quadrants: 'خطوط التربيع',
      quadrantsDesc: 'يقسم المخطط إلى 4 مناطق',
    },
  }[lang]

  function updateConfig(patch: Partial<ScatterChartConfig>) {
    useBuilderStore.setState(state => ({
      widgets: state.widgets.map(w =>
        w.id === widgetId ? { ...w, config: { ...w.config, ...patch } } : w
      ),
      isSaved: false,
    }))
  }

  const sampleFields = ['x', 'y', 'lat', 'lng', 'value', 'size', 'population', 'area']

  return (
    <div>
      <SettingsTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'data' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <SettingsSection title={t.layer}>
            <LayerSelect value={config.layerId ?? ''} onChange={v => updateConfig({ layerId: v })} />
          </SettingsSection>
          <SettingsSection title={t.xField}>
            <FieldSelect
              label={t.xField}
              value={config.xField ?? ''}
              layerId={config.layerId ?? ''}
              fields={numericFields}
              onChange={v => updateConfig({ xField: v })}
              placeholder={lang === 'en' ? 'Select field...' : 'اختر حقل...'}
            />
          </SettingsSection>
          <SettingsSection title={t.yField}>
            <FieldSelect
              label={t.yField}
              value={config.yField ?? ''}
              layerId={config.layerId ?? ''}
              fields={numericFields}
              onChange={v => updateConfig({ yField: v })}
              placeholder={lang === 'en' ? 'Select field...' : 'اختر حقل...'}
            />
          </SettingsSection>
          {config.yField && (
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
          <ColorPicker
            label={t.color}
            value={config.color ?? '#0ea5e9'}
            onChange={v => updateConfig({ color: v })}
          />
          <SliderInput
            label={t.pointSize}
            value={config.pointSize ?? 8}
            min={4} max={24} unit="px"
            onChange={v => updateConfig({ pointSize: v })}
          />
          <SliderInput
            label={t.pointOpacity}
            value={config.pointOpacity ?? 70}
            min={10} max={100} unit="%"
            onChange={v => updateConfig({ pointOpacity: v })}
          />
        </div>
      )}

      {activeTab === 'stats' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ToggleSwitch
            label={t.regression}
            value={config.showRegressionLine ?? false}
            onChange={v => updateConfig({ showRegressionLine: v })}
            description={t.regressionDesc}
          />
          <ToggleSwitch
            label={t.correlation}
            value={config.showCorrelation ?? false}
            onChange={v => updateConfig({ showCorrelation: v })}
            description={t.correlationDesc}
          />
          <ToggleSwitch
            label={t.quadrants}
            value={config.showQuadrants ?? false}
            onChange={v => updateConfig({ showQuadrants: v })}
            description={t.quadrantsDesc}
          />
        </div>
      )}
    </div>
  )
}

export default ScatterChartSettings