import { useBuilderStore } from '../store/builderStore'

export function useLayerFields(layerId: string): string[] {
  const { layers } = useBuilderStore()
  const layer = layers.find(l => l.id === layerId)
  return layer?.fields ?? []
}

export function useLayerData(layerId: string): any[] {
  const { layers } = useBuilderStore()
  const layer = layers.find(l => l.id === layerId)
  if (!layer?.data) return []

  // GeoJSON → array of properties
  if (layer.data.features) {
    return layer.data.features.map((f: any) => f.properties ?? {})
  }
  return []
}