import { useState } from 'react'
import { useTheme } from '../../../../../context/ThemeContext'
import { useBuilderStore } from '../../../store/builderStore'
import { AreaChartConfig } from '../../../types/builder.types'
import SettingsTabs from '../shared/SettingsTabs'
import SettingsSection from '../shared/SettingsSection'
import LayerSelect from '../shared/LayerSelect'
import FieldSelect from '../shared/FieldSelect'
import AggregationSelect from '../shared/AggregationSelect'
import ColorPicker from '../shared/ColorPicker'
import SliderInput from '../shared/SliderInput'
import ToggleSwitch from '../shared/ToggleSwitch'
import { useLayerData } from '../../../hooks/useLayerFields'
import { getCategoryFields, getNumericFields } from '../../../hooks/useAggregatedData'

interface AreaChartSettingsProps {
  widgetId: string
  config: Partial<AreaChartConfig>
}

function AreaChartSettings({ widgetId, config }: AreaChartSettingsProps) {
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
      xField: 'X Axis Field',
      yField: 'Y Axis Field',
      color: 'Line Color',
      thickness: 'Line Thickness',
      fillOpacity: 'Fill Opacity',
      smooth: 'Smooth Curve',
      smoothDesc: 'Makes the line curved instead of sharp angles',
      dots: 'Show Data Points',
      dotsDesc: 'Shows a dot on each data value',
      trend: 'Show Trend Line',
      trendDesc: 'Adds a linear regression line over the area',
      minmax: 'Show Min/Max Markers',
      minmaxDesc: 'Marks the lowest and highest points',
      avg: 'Show Average Line',
      avgDesc: 'Draws a horizontal line at the average value',
    },
    ar: {
      layer: 'مصدر البيانات',
      xField: 'حقل المحور الأفقي',
      yField: 'حقل المحور الرأسي',
      color: 'لون الخط',
      thickness: 'سمك الخط',
      fillOpacity: 'شفافية التعبئة',
      smooth: 'منحنى سلس',
      smoothDesc: 'يجعل الخط منحنياً بدلاً من حواف حادة',
      dots: 'إظهار نقاط البيانات',
      dotsDesc: 'يضع نقطة على كل قيمة',
      trend: 'خط الاتجاه',
      trendDesc: 'يضيف خط انحدار خطي فوق المساحة',
      minmax: 'تمييز القيم القصوى',
      minmaxDesc: 'يحدد أعلى وأدنى نقطة',
      avg: 'خط المتوسط',
      avgDesc: 'يرسم خطاً أفقياً عند قيمة المتوسط',
    },
  }[lang]

  function updateConfig(patch: Partial<AreaChartConfig>) {
    useBuilderStore.setState(state => ({
      widgets: state.widgets.map(w =>
        w.id === widgetId ? { ...w, config: { ...w.config, ...patch } } : w
      ),
      isSaved: false,
    }))
  }

  const sampleFields = ['date', 'month', 'value', 'count', 'temperature', 'rainfall']

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
          <SettingsSection title={t.xField}>
            <FieldSelect
              label={t.xField}
              value={config.xField ?? ''}
              layerId={config.layerId ?? ''}
              fields={categoryFields}
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
            label={t.thickness}
            value={config.lineThickness ?? 2}
            min={1} max={6} unit="px"
            onChange={v => updateConfig({ lineThickness: v })}
          />
          <SliderInput
            label={t.fillOpacity}
            value={config.fillOpacity ?? 20}
            min={0} max={100} unit="%"
            onChange={v => updateConfig({ fillOpacity: v })}
          />
          <ToggleSwitch
            label={t.smooth}
            value={config.smooth ?? true}
            onChange={v => updateConfig({ smooth: v })}
            description={t.smoothDesc}
          />
          <ToggleSwitch
            label={t.dots}
            value={config.showDots ?? false}
            onChange={v => updateConfig({ showDots: v })}
            description={t.dotsDesc}
          />
        </div>
      )}

      {activeTab === 'stats' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ToggleSwitch
            label={t.trend}
            value={config.showTrendLine ?? false}
            onChange={v => updateConfig({ showTrendLine: v })}
            description={t.trendDesc}
          />
          <ToggleSwitch
            label={t.minmax}
            value={config.showMinMax ?? false}
            onChange={v => updateConfig({ showMinMax: v })}
            description={t.minmaxDesc}
          />
          <ToggleSwitch
            label={t.avg}
            value={config.showAverage ?? false}
            onChange={v => updateConfig({ showAverage: v })}
            description={t.avgDesc}
          />
        </div>
      )}
    </div>
  )
}

export default AreaChartSettings