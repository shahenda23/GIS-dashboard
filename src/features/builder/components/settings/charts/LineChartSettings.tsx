import { useState } from 'react'
import { useTheme } from '../../../../../context/ThemeContext'
import { useBuilderStore } from '../../../store/builderStore'
import { LineChartConfig } from '../../../types/builder.types'
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

interface LineChartSettingsProps {
  widgetId: string
  config: Partial<LineChartConfig>
}

function LineChartSettings({ widgetId, config }: LineChartSettingsProps) {
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
      layer: 'Data Layer', xField: 'X Axis', yField: 'Y Axis',
      color: 'Line Color', thickness: 'Line Thickness',
      smooth: 'Smooth Curve', smoothDesc: 'Makes the line curved instead of straight',
      dots: 'Show Data Points', dotsDesc: 'Shows a dot on each data point',
      area: 'Fill Area', areaDesc: 'Fills the area below the line',
      areaOpacity: 'Fill Opacity',
      trend: 'Show Trend Line', trendDesc: 'Adds a linear regression line',
      minmax: 'Show Min/Max', minmaxDesc: 'Marks the lowest and highest points',
      avg: 'Show Average', avgDesc: 'Draws a horizontal line at the average',
    },
    ar: {
      layer: 'مصدر البيانات', xField: 'المحور الأفقي', yField: 'المحور الرأسي',
      color: 'لون الخط', thickness: 'سمك الخط',
      smooth: 'منحنى سلس', smoothDesc: 'يجعل الخط منحنياً بدلاً من مستقيم',
      dots: 'إظهار نقاط البيانات', dotsDesc: 'يضع نقطة على كل قيمة',
      area: 'تعبئة المساحة', areaDesc: 'يملأ المساحة تحت الخط',
      areaOpacity: 'شفافية التعبئة',
      trend: 'خط الاتجاه', trendDesc: 'يضيف خط انحدار خطي',
      minmax: 'تمييز القيم القصوى', minmaxDesc: 'يحدد أعلى وأدنى نقطة',
      avg: 'خط المتوسط', avgDesc: 'يرسم خطاً أفقياً عند المتوسط',
    },
  }[lang]

  function updateConfig(patch: Partial<LineChartConfig>) {
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
            <LayerSelect value={config.layerId ?? ''} onChange={v => updateConfig({ layerId: v })} />
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
          <ColorPicker label={t.color} value={config.color ?? '#0ea5e9'} onChange={v => updateConfig({ color: v })} />
          <SliderInput label={t.thickness} value={config.lineThickness ?? 2} min={1} max={6} unit="px" onChange={v => updateConfig({ lineThickness: v })} />
          <SliderInput label={t.areaOpacity} value={config.areaOpacity ?? 10} min={0} max={100} unit="%" onChange={v => updateConfig({ areaOpacity: v })} />
          <ToggleSwitch label={t.smooth} value={config.smooth ?? true} onChange={v => updateConfig({ smooth: v })} description={t.smoothDesc} />
          <ToggleSwitch label={t.dots} value={config.showDots ?? true} onChange={v => updateConfig({ showDots: v })} description={t.dotsDesc} />
          <ToggleSwitch label={t.area} value={config.showArea ?? false} onChange={v => updateConfig({ showArea: v })} description={t.areaDesc} />
        </div>
      )}

      {activeTab === 'stats' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ToggleSwitch label={t.trend} value={config.showTrendLine ?? false} onChange={v => updateConfig({ showTrendLine: v })} description={t.trendDesc} />
          <ToggleSwitch label={t.minmax} value={config.showMinMax ?? false} onChange={v => updateConfig({ showMinMax: v })} description={t.minmaxDesc} />
          <ToggleSwitch label={t.avg} value={config.showAverage ?? false} onChange={v => updateConfig({ showAverage: v })} description={t.avgDesc} />
        </div>
      )}
    </div>
  )
}

export default LineChartSettings