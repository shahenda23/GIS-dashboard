import { create } from 'zustand'
import { BuilderState, Widget, GeoLayer, DashboardConfig } from '../types/builder.types'

interface BuilderStore extends BuilderState {
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
  saveDashboard: () => void
  loadDashboard: (id: string) => void
  setUnsaved: () => void
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
  widgets: [],
  layers: [],
  selectedWidgetId: null,
  dashboardTitle: 'Untitled Dashboard',
  dashboardId: `dashboard-${Date.now()}`,
  isSaved: true,
  zoomToLayerId: null,

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

  saveDashboard: () => {
    const state = get()
    const config: DashboardConfig = {
      id: state.dashboardId,
      title: state.dashboardTitle,
      widgets: state.widgets,
      layers: state.layers,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnail: '🗺️',
    }

    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('gis-dashboards') || '[]')
    const index = existing.findIndex((d: DashboardConfig) => d.id === config.id)

    if (index >= 0) {
      existing[index] = config
    } else {
      existing.push(config)
    }

    localStorage.setItem('gis-dashboards', JSON.stringify(existing))
    set({ isSaved: true })
  },

  loadDashboard: (id) => {
    const existing = JSON.parse(localStorage.getItem('gis-dashboards') || '[]')
    const config = existing.find((d: DashboardConfig) => d.id === id)
    if (config) {
      set({
        dashboardId: config.id,
        dashboardTitle: config.title,
        widgets: config.widgets,
        layers: config.layers,
        isSaved: true,
      })
    }
  },

  setUnsaved: () => set({ isSaved: false }),
}))