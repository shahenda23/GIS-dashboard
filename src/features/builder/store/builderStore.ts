// import { create } from 'zustand'
// import { BuilderState, Widget, GeoLayer, DashboardConfig } from '../types/builder.types'

// interface BuilderStore extends BuilderState {
//   setTitle: (title: string) => void
//   setDashboardId: (id: string) => void
//   addWidget: (widget: Widget) => void
//   removeWidget: (id: string) => void
//   updateWidget: (id: string, patch: Partial<Widget>) => void
//   updateLayout: (layout: { i: string; x: number; y: number; w: number; h: number }[]) => void
//   selectWidget: (id: string | null) => void
//   addLayer: (layer: GeoLayer) => void
//   removeLayer: (id: string) => void
//   toggleLayer: (id: string) => void
//   updateLayerData: (id: string, data: any) => void
//   zoomToLayer: (id: string) => void
//   saveDashboard: () => void
//   loadDashboard: (id: string) => void
//   setUnsaved: () => void
// }

// export const useBuilderStore = create<BuilderStore>((set, get) => ({
//   widgets: [],
//   layers: [],
//   selectedWidgetId: null,
//   dashboardTitle: 'Untitled Dashboard',
//   dashboardId: `dashboard-${Date.now()}`,
//   isSaved: true,
//   zoomToLayerId: null,

//   setTitle: (title) =>
//     set({ dashboardTitle: title, isSaved: false }),

//   setDashboardId: (id) =>
//     set({ dashboardId: id }),

//   addWidget: (widget) =>
//     set(state => ({
//       widgets: [...state.widgets, widget],
//       isSaved: false,
//     })),

//   removeWidget: (id) =>
//     set(state => ({
//       widgets: state.widgets.filter(w => w.id !== id),
//       selectedWidgetId: state.selectedWidgetId === id ? null : state.selectedWidgetId,
//       isSaved: false,
//     })),

//   updateWidget: (id, patch) =>
//     set(state => ({
//       widgets: state.widgets.map(w => w.id === id ? { ...w, ...patch } : w),
//       isSaved: false,
//     })),

//   updateLayout: (layout) =>
//     set(state => ({
//       widgets: state.widgets.map(w => {
//         const l = layout.find(l => l.i === w.id)
//         return l ? { ...w, x: l.x, y: l.y, w: l.w, h: l.h } : w
//       }),
//       isSaved: false,
//     })),

//   selectWidget: (id) =>
//     set({ selectedWidgetId: id }),

//   addLayer: (layer) =>
//     set(state => ({
//       layers: [...state.layers, layer],
//       isSaved: false,
//     })),

//   removeLayer: (id) =>
//     set(state => ({
//       layers: state.layers.filter(l => l.id !== id),
//       isSaved: false,
//     })),

//   toggleLayer: (id) =>
//     set(state => ({
//       layers: state.layers.map(l =>
//         l.id === id ? { ...l, visible: !l.visible } : l
//       ),
//     })),

//   updateLayerData: (id, data) =>
//     set(state => ({
//       layers: state.layers.map(l =>
//         l.id === id ? { ...l, data } : l
//       ),
//     })),

//   zoomToLayer: (id) => set({ zoomToLayerId: id }),

//   saveDashboard: () => {
//     const state = get()
//     const config: DashboardConfig = {
//       id: state.dashboardId,
//       title: state.dashboardTitle,
//       widgets: state.widgets,
//       layers: state.layers,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       thumbnail: '🗺️',
//     }

//     // Save to localStorage
//     const existing = JSON.parse(localStorage.getItem('gis-dashboards') || '[]')
//     const index = existing.findIndex((d: DashboardConfig) => d.id === config.id)

//     if (index >= 0) {
//       existing[index] = config
//     } else {
//       existing.push(config)
//     }

//     localStorage.setItem('gis-dashboards', JSON.stringify(existing))
//     set({ isSaved: true })
//   },

//   loadDashboard: (id) => {
//     const existing = JSON.parse(localStorage.getItem('gis-dashboards') || '[]')
//     const config = existing.find((d: DashboardConfig) => d.id === id)
//     if (config) {
//       set({
//         dashboardId: config.id,
//         dashboardTitle: config.title,
//         widgets: config.widgets,
//         layers: config.layers,
//         isSaved: true,
//       })
//     }
//   },

//   setUnsaved: () => set({ isSaved: false }),
// }))

import { create } from 'zustand'
import { BuilderState, Widget, GeoLayer, DashboardConfig } from '../types/builder.types'
import { supabase } from '../../../lib/supabase'

interface BuilderStore extends BuilderState {
  isLoading: boolean
  isSaving: boolean
  isPublic: boolean
  ownerId: string | null
  setTitle: (title: string) => void
  setDashboardId: (id: string) => void
  addWidget: (widget: Widget) => void
  removeWidget: (id: string) => void
  updateWidget: (id: string, patch: Partial<Widget>) => void
  updateLayout: (layout: { i: string; x: number; y: number; w: number; h: number }[]) => void
  selectWidget: (id: string | null) => void
  addLayer: (layer: GeoLayer) => void
  removeLayer: (id: string) => void
  toggleLayer: (id: string) => void
  updateLayerData: (id: string, data: any) => void
  zoomToLayer: (id: string) => void
  setPublic: (val: boolean) => void
  saveDashboard: () => Promise<void>
  loadDashboard: (id: string) => Promise<void>
  setUnsaved: () => void
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  widgets: [],
  layers: [],
  selectedWidgetId: null,
  dashboardTitle: 'Untitled Dashboard',
  dashboardId: crypto.randomUUID(),
  isSaved: true,
  zoomToLayerId: null,
  isLoading: false,
  isSaving: false,
  isPublic: false,
  ownerId: null,
  updatedAt: null as string | null,

  setTitle: (title) =>
    set({ dashboardTitle: title, isSaved: false }),

  setDashboardId: (id) =>
    set({ dashboardId: id }),

  addWidget: (widget) =>
    set(state => ({
      widgets: [...state.widgets, widget],
      isSaved: false,
    })),

  removeWidget: (id) =>
    set(state => ({
      widgets: state.widgets.filter(w => w.id !== id),
      selectedWidgetId: state.selectedWidgetId === id ? null : state.selectedWidgetId,
      isSaved: false,
    })),

  updateWidget: (id, patch) =>
    set(state => ({
      widgets: state.widgets.map(w => w.id === id ? { ...w, ...patch } : w),
      isSaved: false,
    })),

  updateLayout: (layout) =>
    set(state => ({
      widgets: state.widgets.map(w => {
        const l = layout.find(l => l.i === w.id)
        return l ? { ...w, x: l.x, y: l.y, w: l.w, h: l.h } : w
      }),
      isSaved: false,
    })),

  selectWidget: (id) =>
    set({ selectedWidgetId: id }),

  addLayer: (layer) =>
    set(state => ({
      layers: [...state.layers, layer],
      isSaved: false,
    })),

  removeLayer: (id) =>
    set(state => ({
      layers: state.layers.filter(l => l.id !== id),
      isSaved: false,
    })),

  toggleLayer: (id) =>
    set(state => ({
      layers: state.layers.map(l =>
        l.id === id ? { ...l, visible: !l.visible } : l
      ),
    })),

  updateLayerData: (id, data) =>
    set(state => ({
      layers: state.layers.map(l =>
        l.id === id ? { ...l, data } : l
      ),
    })),

  zoomToLayer: (id) => set({ zoomToLayerId: id }),

  setPublic: (val) => set({ isPublic: val, isSaved: false }),

  // ── Save to Supabase ──────────────────────────────────────────────────────
  saveDashboard: async () => {
    set({ isSaving: true })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error('No user logged in')
      set({ isSaving: false })
      return
    }

    const state = get()

    const layersToSave = state.layers.map(l => ({
      id:      l.id,
      name:    l.name,
      type:    l.type,
      visible: l.visible,
      color:   l.color,
      fields:  l.fields ?? [],
      data:    l.data ?? null,
    }))

    const payload = {
      id:         state.dashboardId,
      user_id:    user.id,
      title:      state.dashboardTitle,
      widgets:    state.widgets,
      layers:     layersToSave,
      is_public:  state.isPublic,
      thumbnail:  '🗺️',
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('dashboards')
      .upsert(payload, { onConflict: 'id' })

    if (error) {
      console.error('Save error:', error.message)
    } else {
      set({ isSaved: true })
    }
    set({ isSaving: false })
  },
  // ── Load from Supabase ────────────────────────────────────────────────────
  loadDashboard: async (id: string) => {
    set({ isLoading: true })
    const { data, error } = await supabase
      .from('dashboards')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error('Load error:', error?.message)
      set({ isLoading: false, ownerId: null })
      return
    }

    set({
      dashboardId:    data.id,
      dashboardTitle: data.title,
      widgets:        data.widgets    ?? [],
      layers:         data.layers     ?? [],
      isPublic:       data.is_public  ?? false,
      ownerId:        data.user_id    ?? null,
      isSaved:        true,
      zoomToLayerId:  null,
      isLoading:      false,
      updatedAt:      data.updated_at ?? null,
    })
  },

  setUnsaved: () => set({ isSaved: false }),
}))