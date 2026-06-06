// import { useState } from 'react'
// import { useTheme } from '../../../../../context/ThemeContext'
// import { useBuilderStore } from '../../../store/builderStore'
// import { MapConfig, PopupFieldConfig } from '../../../types/builder.types'
// import SettingsTabs from '../shared/SettingsTabs'
// import SettingsSection from '../shared/SettingsSection'
// import LayerSelect from '../shared/LayerSelect'
// import SliderInput from '../shared/SliderInput'
// import ToggleSwitch from '../shared/ToggleSwitch'
// import { BASEMAP_STYLES } from '../../widgets/map/BasemapGallery'

// interface MapSettingsProps {
//   widgetId: string
//   config: Partial<MapConfig>
// }

// function MapSettings({ widgetId, config }: MapSettingsProps) {
//   const { lang } = useTheme()
//   const [activeTab, setActiveTab] = useState('data')

//   const layers = useBuilderStore(s => s.layers)
//   const selectedLayer = layers.find(l => l.id === config.layerId)
//   const availableFields = selectedLayer?.fields ?? []

//   const popupFields: PopupFieldConfig[] = config.popupFields?.length
//   ? config.popupFields
//   : availableFields.map(f => ({ field: f, alias: f, visible: true }))



//   const tabs = {
//     en: [{ id: 'data', label: 'Data' }, { id: 'visual', label: 'Visual' }, { id: 'behavior', label: 'Behavior' }],
//     ar: [{ id: 'data', label: 'البيانات' }, { id: 'visual', label: 'المظهر' }, { id: 'behavior', label: 'السلوك' }],
//   }[lang]

//   const t = {
//     en: {
//       layer: 'Map Layer',
//       style: 'Map Style',
//       zoom: 'Default Zoom Level',
//       navigation: 'Show Navigation Controls',
//       navigationDesc: 'Shows zoom in/out and compass buttons',
//       scale: 'Show Scale Bar',
//       scaleDesc: 'Shows a distance scale at the bottom of the map',
//       legend: 'Show Legend',
//       popup: 'Show Feature Popup',
//       popupDesc: 'Shows a popup with feature info when clicking on the map',
//       legendDesc: 'Shows a panel listing the visible map layers',
//       basemapGallery: 'Show Basemap Gallery',
//       basemapGalleryDesc: 'Shows the basemap switcher panel on the map',
//       allowZoom: 'Allow User Zoom',
//       allowZoomDesc: 'User can zoom in/out with scroll or pinch',
//       allowPan: 'Allow User Pan',
//       allowPanDesc: 'User can drag the map to move around',
//     },
//     ar: {
//       layer: 'طبقة الخريطة',
//       style: 'نمط الخريطة',
//       zoom: 'مستوى التكبير الافتراضي',
//       navigation: 'إظهار أدوات التنقل',
//       navigationDesc: 'يعرض أزرار التكبير والبوصلة',
//       scale: 'إظهار مقياس المسافة',
//       scaleDesc: 'يعرض مقياساً للمسافة في أسفل الخريطة',
//       popup: 'إظهار النافذة المنبثقة',
//       popupDesc: 'يعرض نافذة منبثقة مع معلومات الميزات عند النقر على الخريطة',
//       legend: 'إظهار المفتاح',
//       legendDesc: 'يعرض لوحة بأسماء الطبقات المرئية على الخريطة',
//       basemapGallery: 'إظهار معرض الخرائط الأساسية',
//       basemapGalleryDesc: 'يعرض لوحة تبديل الخريطة الأساسية على الخريطة',
//       allowZoom: 'السماح بالتكبير',
//       allowZoomDesc: 'يمكن للمستخدم التكبير بالتمرير أو القرص',
//       allowPan: 'السماح بالتحريك',
//       allowPanDesc: 'يمكن للمستخدم سحب الخريطة للتنقل',
//     },
//   }[lang]

//   function updateConfig(patch: Partial<MapConfig>) {
//     useBuilderStore.setState(state => ({
//       widgets: state.widgets.map(w =>
//         w.id === widgetId ? { ...w, config: { ...w.config, ...patch } } : w
//       ),
//       isSaved: false,
//     }))
//   }

//   return (
//     <div>
//       <SettingsTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

//       {activeTab === 'data' && (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//           <SettingsSection title={t.layer}>
//             <LayerSelect
//               value={config.layerId ?? ''}
//               onChange={v => updateConfig({ layerId: v, popupFields: undefined, popupTitleField: undefined })}
//             />
//           </SettingsSection>

//           <SettingsSection title={t.style}>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
//               {BASEMAP_STYLES.map(style => (
//                 <label
//                   key={style.id}
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '8px',
//                     padding: '8px 10px',
//                     borderRadius: 'var(--radius-md)',
//                     border: `1px solid ${(config.mapStyle ?? BASEMAP_STYLES[0].id) === style.id
//                       ? 'var(--accent)'
//                       : 'var(--border)'}`,
//                     background: (config.mapStyle ?? BASEMAP_STYLES[0].id) === style.id
//                       ? 'var(--accent-light)'
//                       : 'var(--page-bg)',
//                     cursor: 'pointer',
//                     transition: 'all 0.15s',
//                     fontSize: '12px',
//                     color: 'var(--text-primary)',
//                   }}
//                 >
//                   <input
//                     type="radio"
//                     name="mapStyle"
//                     value={style.id}
//                     checked={(config.mapStyle ?? BASEMAP_STYLES[0].id) === style.id}
//                     onChange={() => updateConfig({ mapStyle: style.id })}
//                     style={{ accentColor: 'var(--accent)' }}
//                   />
//                   {style.label}
//                 </label>
//               ))}
//             </div>
//           </SettingsSection>
//         </div>
//       )}

//       {activeTab === 'visual' && (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//           <SliderInput
//             label={t.zoom}
//             value={config.zoom ?? 10}
//             min={1} max={20}
//             onChange={v => updateConfig({ zoom: v })}
//           />
//           <ToggleSwitch
//             label={t.navigation}
//             value={config.showNavigation ?? true}
//             onChange={v => updateConfig({ showNavigation: v })}
//             description={t.navigationDesc}
//           />
//           <ToggleSwitch
//             label={t.scale}
//             value={config.showScale ?? false}
//             onChange={v => updateConfig({ showScale: v })}
//             description={t.scaleDesc}
//           />
//           <ToggleSwitch
//             label={t.legend}
//             value={config.showLegend ?? true}
//             onChange={v => updateConfig({ showLegend: v })}
//             description={t.legendDesc}
//           />
//           <ToggleSwitch
//             label={t.popup}
//             value={config.showPopup ?? true}
//             onChange={v => updateConfig({ showPopup: v })}
//             description={t.popupDesc}
//           />
//           <ToggleSwitch
//             label={t.basemapGallery}
//             value={config.showBasemapGallery ?? true}
//             onChange={v => updateConfig({ showBasemapGallery: v })}
//             description={t.basemapGalleryDesc}
//           />

//           {config.showPopup && availableFields.length > 0 && (
//             <SettingsSection title={lang === 'ar' ? 'إعدادات النافذة المنبثقة' : 'Popup Configuration'}>
//               {/* ── Title field ── */}
//               <div style={{ marginBottom: '12px' }}>
//                 <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
//                   {lang === 'ar' ? 'حقل العنوان' : 'Title Field'}
//                 </label>
//                 <select
//                   value={config.popupTitleField ?? ''}
//                   onChange={e => updateConfig({ popupTitleField: e.target.value || undefined })}
//                   style={{
//                     width: '100%',
//                     padding: '6px 8px',
//                     borderRadius: 'var(--radius-md)',
//                     border: '1px solid var(--border)',
//                     background: 'var(--input-bg)',
//                     color: 'var(--text-primary)',
//                     fontSize: '12px',
//                   }}
//                 >
//                   <option value="">{lang === 'ar' ? '-- بدون عنوان --' : '-- No title --'}</option>
//                   {availableFields.map(f => (
//                     <option key={f} value={f}>{f}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* ── Field list ── */}
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
//                 {popupFields.map((pf, i) => (
//                   <div
//                     key={pf.field}
//                     style={{
//                       display: 'grid',
//                       gridTemplateColumns: '18px 1fr',
//                       gap: '8px',
//                       alignItems: 'center',
//                       padding: '8px 10px',
//                       borderRadius: 'var(--radius-md)',
//                       border: '1px solid var(--border)',
//                       background: pf.visible ? 'var(--page-bg)' : 'transparent',
//                       opacity: pf.visible ? 1 : 0.5,
//                     }}
//                   >
//                     {/* visibility checkbox */}
//                     <input
//                       type="checkbox"
//                       checked={pf.visible}
//                       onChange={e => {
//                         const next = [...popupFields]
//                         next[i] = { ...pf, visible: e.target.checked }
//                         updateConfig({ popupFields: next })
//                       }}
//                       style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
//                     />

//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
//                       {/* alias input */}
//                       <input
//                         type="text"
//                         value={pf.alias}
//                         onChange={e => {
//                           const next = [...popupFields]
//                           next[i] = { ...pf, alias: e.target.value }
//                           updateConfig({ popupFields: next })
//                         }}
//                         style={{
//                           width: '100%',
//                           padding: '4px 6px',
//                           borderRadius: 'var(--radius-sm)',
//                           border: '1px solid var(--border)',
//                           background: 'var(--input-bg)',
//                           color: 'var(--text-primary)',
//                           fontSize: '12px',
//                           boxSizing: 'border-box',
//                         }}
//                       />
//                       {/* original field name as hint */}
//                       <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
//                         {pf.field}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </SettingsSection>
//           )}
//         </div>
//       )}

//       {activeTab === 'behavior' && (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//           <ToggleSwitch
//             label={t.allowPan}
//             value={config.allowPan ?? true}
//             onChange={v => updateConfig({ allowPan: v })}
//             description={t.allowPanDesc}
//           />
//         </div>
//       )}
//     </div>
//   )
// }

// export default MapSettings

// import { useState } from 'react'
// import { useTheme } from '../../../../../context/ThemeContext'
// import { useBuilderStore } from '../../../store/builderStore'
// import { MapConfig, PopupFieldConfig } from '../../../types/builder.types'
// import SettingsTabs from '../shared/SettingsTabs'
// import SettingsSection from '../shared/SettingsSection'
// import LayerSelect from '../shared/LayerSelect'
// import SliderInput from '../shared/SliderInput'
// import ToggleSwitch from '../shared/ToggleSwitch'

// interface MapSettingsProps {
//   widgetId: string
//   config: Partial<MapConfig>
// }

// const MAP_STYLES = [
//   { value: 'https://tiles.openfreemap.org/styles/liberty',  label: 'Liberty (Default)' },
//   { value: 'https://tiles.openfreemap.org/styles/bright',   label: 'Bright' },
//   { value: 'https://tiles.openfreemap.org/styles/positron', label: 'Positron (Light)' },
//   { value: 'https://tiles.openfreemap.org/styles/fiord',    label: 'Fiord (Dark)' },
// ]

// function MapSettings({ widgetId, config }: MapSettingsProps) {
//   const { lang } = useTheme()
//   const [activeTab, setActiveTab] = useState('data')

//   const layers = useBuilderStore(s => s.layers)
//   const selectedLayer = layers.find(l => l.id === config.layerId)
//   const availableFields = selectedLayer?.fields ?? []

//   const popupFields: PopupFieldConfig[] = config.popupFields?.length
//   ? config.popupFields
//   : availableFields.map(f => ({ field: f, alias: f, visible: true }))



//   const tabs = {
//     en: [{ id: 'data', label: 'Data' }, { id: 'visual', label: 'Visual' }, { id: 'behavior', label: 'Behavior' }],
//     ar: [{ id: 'data', label: 'البيانات' }, { id: 'visual', label: 'المظهر' }, { id: 'behavior', label: 'السلوك' }],
//   }[lang]

//   const t = {
//     en: {
//       layer: 'Map Layer',
//       style: 'Map Style',
//       zoom: 'Default Zoom Level',
//       navigation: 'Show Navigation Controls',
//       navigationDesc: 'Shows zoom in/out and compass buttons',
//       scale: 'Show Scale Bar',
//       scaleDesc: 'Shows a distance scale at the bottom of the map',
//       legend: 'Show Legend',
//       popup: 'Show Feature Popup',
//       popupDesc: 'Shows a popup with feature info when clicking on the map',
//       legendDesc: 'Shows a panel listing the visible map layers',
//       allowZoom: 'Allow User Zoom',
//       allowZoomDesc: 'User can zoom in/out with scroll or pinch',
//       allowPan: 'Allow User Pan',
//       allowPanDesc: 'User can drag the map to move around',
//     },
//     ar: {
//       layer: 'طبقة الخريطة',
//       style: 'نمط الخريطة',
//       zoom: 'مستوى التكبير الافتراضي',
//       navigation: 'إظهار أدوات التنقل',
//       navigationDesc: 'يعرض أزرار التكبير والبوصلة',
//       scale: 'إظهار مقياس المسافة',
//       scaleDesc: 'يعرض مقياساً للمسافة في أسفل الخريطة',
//       popup: 'إظهار النافذة المنبثقة',
//       popupDesc: 'يعرض نافذة منبثقة مع معلومات الميزات عند النقر على الخريطة',
//       legend: 'إظهار المفتاح',
//       legendDesc: 'يعرض لوحة بأسماء الطبقات المرئية على الخريطة',
//       allowZoom: 'السماح بالتكبير',
//       allowZoomDesc: 'يمكن للمستخدم التكبير بالتمرير أو القرص',
//       allowPan: 'السماح بالتحريك',
//       allowPanDesc: 'يمكن للمستخدم سحب الخريطة للتنقل',
//     },
//   }[lang]

//   function updateConfig(patch: Partial<MapConfig>) {
//     useBuilderStore.setState(state => ({
//       widgets: state.widgets.map(w =>
//         w.id === widgetId ? { ...w, config: { ...w.config, ...patch } } : w
//       ),
//       isSaved: false,
//     }))
//   }

//   return (
//     <div>
//       <SettingsTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

//       {activeTab === 'data' && (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
//           <SettingsSection title={t.layer}>
//             <LayerSelect
//               value={config.layerId ?? ''}
//               onChange={v => updateConfig({ layerId: v, popupFields: undefined, popupTitleField: undefined })}
//             />
//           </SettingsSection>

//           <SettingsSection title={t.style}>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
//               {MAP_STYLES.map(style => (
//                 <label
//                   key={style.value}
//                   style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '8px',
//                     padding: '8px 10px',
//                     borderRadius: 'var(--radius-md)',
//                     border: `1px solid ${(config.mapStyle ?? MAP_STYLES[0].value) === style.value
//                       ? 'var(--accent)'
//                       : 'var(--border)'}`,
//                     background: (config.mapStyle ?? MAP_STYLES[0].value) === style.value
//                       ? 'var(--accent-light)'
//                       : 'var(--page-bg)',
//                     cursor: 'pointer',
//                     transition: 'all 0.15s',
//                     fontSize: '12px',
//                     color: 'var(--text-primary)',
//                   }}
//                 >
//                   <input
//                     type="radio"
//                     name="mapStyle"
//                     value={style.value}
//                     checked={(config.mapStyle ?? MAP_STYLES[0].value) === style.value}
//                     onChange={() => updateConfig({ mapStyle: style.value })}
//                     style={{ accentColor: 'var(--accent)' }}
//                   />
//                   {style.label}
//                 </label>
//               ))}
//             </div>
//           </SettingsSection>
//         </div>
//       )}

//       {activeTab === 'visual' && (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//           <SliderInput
//             label={t.zoom}
//             value={config.zoom ?? 10}
//             min={1} max={20}
//             onChange={v => updateConfig({ zoom: v })}
//           />
//           <ToggleSwitch
//             label={t.navigation}
//             value={config.showNavigation ?? true}
//             onChange={v => updateConfig({ showNavigation: v })}
//             description={t.navigationDesc}
//           />
//           <ToggleSwitch
//             label={t.scale}
//             value={config.showScale ?? false}
//             onChange={v => updateConfig({ showScale: v })}
//             description={t.scaleDesc}
//           />
//           <ToggleSwitch
//             label={t.legend}
//             value={config.showLegend ?? true}
//             onChange={v => updateConfig({ showLegend: v })}
//             description={t.legendDesc}
//           />
//           <ToggleSwitch
//             label={t.popup}
//             value={config.showPopup ?? true}
//             onChange={v => updateConfig({ showPopup: v })}
//             description={t.popupDesc}
//           />

//           {config.showPopup && availableFields.length > 0 && (
//             <SettingsSection title={lang === 'ar' ? 'إعدادات النافذة المنبثقة' : 'Popup Configuration'}>
//               {/* ── Title field ── */}
//               <div style={{ marginBottom: '12px' }}>
//                 <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
//                   {lang === 'ar' ? 'حقل العنوان' : 'Title Field'}
//                 </label>
//                 <select
//                   value={config.popupTitleField ?? ''}
//                   onChange={e => updateConfig({ popupTitleField: e.target.value || undefined })}
//                   style={{
//                     width: '100%',
//                     padding: '6px 8px',
//                     borderRadius: 'var(--radius-md)',
//                     border: '1px solid var(--border)',
//                     background: 'var(--input-bg)',
//                     color: 'var(--text-primary)',
//                     fontSize: '12px',
//                   }}
//                 >
//                   <option value="">{lang === 'ar' ? '-- بدون عنوان --' : '-- No title --'}</option>
//                   {availableFields.map(f => (
//                     <option key={f} value={f}>{f}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* ── Field list ── */}
//               <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
//                 {popupFields.map((pf, i) => (
//                   <div
//                     key={pf.field}
//                     style={{
//                       display: 'grid',
//                       gridTemplateColumns: '18px 1fr',
//                       gap: '8px',
//                       alignItems: 'center',
//                       padding: '8px 10px',
//                       borderRadius: 'var(--radius-md)',
//                       border: '1px solid var(--border)',
//                       background: pf.visible ? 'var(--page-bg)' : 'transparent',
//                       opacity: pf.visible ? 1 : 0.5,
//                     }}
//                   >
//                     {/* visibility checkbox */}
//                     <input
//                       type="checkbox"
//                       checked={pf.visible}
//                       onChange={e => {
//                         const next = [...popupFields]
//                         next[i] = { ...pf, visible: e.target.checked }
//                         updateConfig({ popupFields: next })
//                       }}
//                       style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
//                     />

//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
//                       {/* alias input */}
//                       <input
//                         type="text"
//                         value={pf.alias}
//                         onChange={e => {
//                           const next = [...popupFields]
//                           next[i] = { ...pf, alias: e.target.value }
//                           updateConfig({ popupFields: next })
//                         }}
//                         style={{
//                           width: '100%',
//                           padding: '4px 6px',
//                           borderRadius: 'var(--radius-sm)',
//                           border: '1px solid var(--border)',
//                           background: 'var(--input-bg)',
//                           color: 'var(--text-primary)',
//                           fontSize: '12px',
//                           boxSizing: 'border-box',
//                         }}
//                       />
//                       {/* original field name as hint */}
//                       <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
//                         {pf.field}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </SettingsSection>
//           )}
//         </div>
//       )}

//       {activeTab === 'behavior' && (
//         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
//           <ToggleSwitch
//             label={t.allowPan}
//             value={config.allowPan ?? true}
//             onChange={v => updateConfig({ allowPan: v })}
//             description={t.allowPanDesc}
//           />
//         </div>
//       )}
//     </div>
//   )
// }

// export default MapSettings

import { useState } from 'react'
import { useTheme } from '../../../../../context/ThemeContext'
import { useBuilderStore } from '../../../store/builderStore'
import { MapConfig, PopupFieldConfig } from '../../../types/builder.types'
import SettingsTabs from '../shared/SettingsTabs'
import SettingsSection from '../shared/SettingsSection'
import LayerSelect from '../shared/LayerSelect'
import SliderInput from '../shared/SliderInput'
import ToggleSwitch from '../shared/ToggleSwitch'

interface MapSettingsProps {
  widgetId: string
  config: Partial<MapConfig>
}

// Mapbox-hosted styles — same visual categories as before, now correct URLs
const MAP_STYLES = [
  { value: 'mapbox://styles/mapbox/streets-v12',           label: 'Streets (Default)' },
  { value: 'mapbox://styles/mapbox/light-v11',             label: 'Light' },
  { value: 'mapbox://styles/mapbox/dark-v11',              label: 'Dark' },
  { value: 'mapbox://styles/mapbox/outdoors-v12',          label: 'Outdoors' },
  { value: 'mapbox://styles/mapbox/satellite-v9',          label: 'Satellite' },
  { value: 'mapbox://styles/mapbox/satellite-streets-v12', label: 'Satellite + Streets' },
]

function MapSettings({ widgetId, config }: MapSettingsProps) {
  const { lang } = useTheme()
  const [activeTab, setActiveTab] = useState('data')

  const { layers } = useBuilderStore()
  const selectedLayer = layers.find(l => l.id === config.layerId)
  const availableFields = selectedLayer?.fields ?? []

  const popupFields: PopupFieldConfig[] = config.popupFields?.length
    ? config.popupFields
    : availableFields.map(f => ({ field: f, alias: f, visible: true }))

  const tabs = {
    en: [{ id: 'data', label: 'Data' }, { id: 'visual', label: 'Visual' }, { id: 'behavior', label: 'Behavior' }],
    ar: [{ id: 'data', label: 'البيانات' }, { id: 'visual', label: 'المظهر' }, { id: 'behavior', label: 'السلوك' }],
  }[lang]

  const t = {
    en: {
      layer: 'Map Layer',
      style: 'Map Style',
      zoom: 'Default Zoom Level',
      navigation: 'Show Navigation Controls',
      navigationDesc: 'Shows zoom in/out and compass buttons',
      scale: 'Show Scale Bar',
      scaleDesc: 'Shows a distance scale at the bottom of the map',
      legend: 'Show Legend',
      popup: 'Show Feature Popup',
      popupDesc: 'Shows a popup with feature info when clicking on the map',
      legendDesc: 'Shows a panel listing the visible map layers',
      allowZoom: 'Allow User Zoom',
      allowZoomDesc: 'User can zoom in/out with scroll or pinch',
      allowPan: 'Allow User Pan',
      allowPanDesc: 'User can drag the map to move around',
    },
    ar: {
      layer: 'طبقة الخريطة',
      style: 'نمط الخريطة',
      zoom: 'مستوى التكبير الافتراضي',
      navigation: 'إظهار أدوات التنقل',
      navigationDesc: 'يعرض أزرار التكبير والبوصلة',
      scale: 'إظهار مقياس المسافة',
      scaleDesc: 'يعرض مقياساً للمسافة في أسفل الخريطة',
      popup: 'إظهار النافذة المنبثقة',
      popupDesc: 'يعرض نافذة منبثقة مع معلومات الميزات عند النقر على الخريطة',
      legend: 'إظهار المفتاح',
      legendDesc: 'يعرض لوحة بأسماء الطبقات المرئية على الخريطة',
      allowZoom: 'السماح بالتكبير',
      allowZoomDesc: 'يمكن للمستخدم التكبير بالتمرير أو القرص',
      allowPan: 'السماح بالتحريك',
      allowPanDesc: 'يمكن للمستخدم سحب الخريطة للتنقل',
    },
  }[lang]

  function updateConfig(patch: Partial<MapConfig>) {
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
              onChange={v => updateConfig({ layerId: v, popupFields: undefined, popupTitleField: undefined })}
            />
          </SettingsSection>

          <SettingsSection title={t.style}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {MAP_STYLES.map(style => (
                <label
                  key={style.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${(config.mapStyle ?? MAP_STYLES[0].value) === style.value
                      ? 'var(--accent)'
                      : 'var(--border)'}`,
                    background: (config.mapStyle ?? MAP_STYLES[0].value) === style.value
                      ? 'var(--accent-light)'
                      : 'var(--page-bg)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                  }}
                >
                  <input
                    type="radio"
                    name="mapStyle"
                    value={style.value}
                    checked={(config.mapStyle ?? MAP_STYLES[0].value) === style.value}
                    onChange={() => updateConfig({ mapStyle: style.value })}
                    style={{ accentColor: 'var(--accent)' }}
                  />
                  {style.label}
                </label>
              ))}
            </div>
          </SettingsSection>
        </div>
      )}

      {activeTab === 'visual' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <SliderInput
            label={t.zoom}
            value={config.zoom ?? 10}
            min={1} max={20}
            onChange={v => updateConfig({ zoom: v })}
          />
          <ToggleSwitch
            label={t.navigation}
            value={config.showNavigation ?? true}
            onChange={v => updateConfig({ showNavigation: v })}
            description={t.navigationDesc}
          />
          <ToggleSwitch
            label={t.scale}
            value={config.showScale ?? false}
            onChange={v => updateConfig({ showScale: v })}
            description={t.scaleDesc}
          />
          <ToggleSwitch
            label={t.legend}
            value={config.showLegend ?? false}
            onChange={v => updateConfig({ showLegend: v })}
            description={t.legendDesc}
          />
          <ToggleSwitch
            label={t.popup}
            value={config.showPopup ?? false}
            onChange={v => updateConfig({ showPopup: v })}
            description={t.popupDesc}
          />

          {config.showPopup && availableFields.length > 0 && (
            <SettingsSection title={lang === 'ar' ? 'إعدادات النافذة المنبثقة' : 'Popup Configuration'}>
              {/* ── Title field ── */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  {lang === 'ar' ? 'حقل العنوان' : 'Title Field'}
                </label>
                <select
                  value={config.popupTitleField ?? ''}
                  onChange={e => updateConfig({ popupTitleField: e.target.value || undefined })}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                  }}
                >
                  <option value="">{lang === 'ar' ? '-- بدون عنوان --' : '-- No title --'}</option>
                  {availableFields.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* ── Field list ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {popupFields.map((pf, i) => (
                  <div
                    key={pf.field}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '18px 1fr',
                      gap: '8px',
                      alignItems: 'center',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      background: pf.visible ? 'var(--page-bg)' : 'transparent',
                      opacity: pf.visible ? 1 : 0.5,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={pf.visible}
                      onChange={e => {
                        const updated = popupFields.map((f, j) =>
                          j === i ? { ...f, visible: e.target.checked } : f
                        )
                        updateConfig({ popupFields: updated })
                      }}
                      style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{pf.field}</span>
                      <input
                        type="text"
                        value={pf.alias}
                        onChange={e => {
                          const updated = popupFields.map((f, j) =>
                            j === i ? { ...f, alias: e.target.value } : f
                          )
                          updateConfig({ popupFields: updated })
                        }}
                        placeholder="Display label"
                        style={{
                          padding: '4px 6px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                          background: 'var(--input-bg)',
                          color: 'var(--text-primary)',
                          fontSize: '11px',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SettingsSection>
          )}
        </div>
      )}

      {activeTab === 'behavior' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ToggleSwitch
            label={t.allowZoom}
            value={config.allowZoom ?? true}
            onChange={v => updateConfig({ allowZoom: v })}
            description={t.allowZoomDesc}
          />
          <ToggleSwitch
            label={t.allowPan}
            value={config.allowPan ?? true}
            onChange={v => updateConfig({ allowPan: v })}
            description={t.allowPanDesc}
          />
        </div>
      )}
    </div>
  )
}

export default MapSettings