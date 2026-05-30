// import { useMemo } from 'react'
// import { useLayerData } from './useLayerFields'
// import type { AggregationType } from '../types/builder.types'
// export type { AggregationType } from '../types/builder.types'

// export interface AggregationConfig {
//   layerId: string
//   xField: string
//   yField: string
//   aggregation: AggregationType
// }

// export interface AggregatedRow {
//   x: string
//   y: number
// }

// export function useAggregatedData(config: Partial<AggregationConfig>): AggregatedRow[] {
//   const layerData = useLayerData(config.layerId ?? '')

//   return useMemo(() => {
//     if (!layerData.length || !config.xField || !config.yField) return []

//     // Step 1 — group by X field
//     const groups = new Map<string, number[]>()

//     layerData.forEach(row => {
//       const xVal = String(row[config.xField!] ?? 'Unknown')
//       const yVal = Number(row[config.yField!])

//       if (isNaN(yVal)) return

//       if (!groups.has(xVal)) groups.set(xVal, [])
//       groups.get(xVal)!.push(yVal)
//     })

//     // Step 2 — aggregate
//     const agg = config.aggregation ?? 'sum'

//     return Array.from(groups.entries()).map(([x, values]) => ({
//       x,
//       y: aggregate(values, agg),
//     }))
//   }, [layerData, config.xField, config.yField, config.aggregation])
// }

// // function aggregate(values: number[], type: AggregationType): number {
// //   if (values.length === 0) return 0

// //   switch (type) {
// //     case 'sum':   return round(values.reduce((a, b) => a + b, 0))
// //     case 'avg':   return round(values.reduce((a, b) => a + b, 0) / values.length)
// //     case 'min':   return Math.min(...values)
// //     case 'max':   return Math.max(...values)
// //     case 'count': return values.length
// //     default:      return 0
// //   }
// // }

// function aggregate(values: number[], type: AggregationType): number {
//   if (values.length === 0) return 0

//   switch (type) {
//     case 'sum':   return round(values.reduce((a, b) => a + b, 0))
//     case 'avg':   return round(values.reduce((a, b) => a + b, 0) / values.length)
//     // التعديل الآمن هنا بدلاً من الـ Spread Operator (...) لحماية الـ Stack
//     case 'min':   return values.reduce((min, p) => p < min ? p : min, values[0])
//     case 'max':   return values.reduce((max, p) => p > max ? p : max, values[0])
//     case 'count': return values.length
//     default:      return 0
//   }
// }

// function round(n: number): number {
//   return Math.round(n * 100) / 100
// }

// // ── Helper — detect numeric fields ────────────────────────────────────────────
// export function getNumericFields(data: any[]): string[] {
//   if (!data.length) return []
//   return Object.keys(data[0]).filter(key => {
//     const sample = data.slice(0, 10)
//     return sample.every(row => !isNaN(Number(row[key])) && row[key] !== '')
//   })
// }

// // ── Helper — detect string/category fields ────────────────────────────────────
// export function getCategoryFields(data: any[]): string[] {
//   if (!data.length) return []
//   return Object.keys(data[0]).filter(key => {
//     const sample = data.slice(0, 10)
//     return sample.some(row => isNaN(Number(row[key])) || row[key] === '')
//   })
// }

import { useMemo } from 'react'
import { useLayerData } from './useLayerFields'
import type { AggregationType } from '../types/builder.types'
export type { AggregationType } from '../types/builder.types'

export interface AggregationConfig {
  layerId: string
  xField: string
  yField: string
  aggregation: AggregationType
}

export interface AggregatedRow {
  x: string
  y: number
}

export function useAggregatedData(config: Partial<AggregationConfig>): AggregatedRow[] {
  const layerData = useLayerData(config.layerId ?? '')

  // ← خد القيم برا الـ useMemo عشان الـ dependencies تكون primitive مش object
  const xField      = config.xField
  const yField      = config.yField
  const aggregation = config.aggregation ?? 'sum'

  return useMemo(() => {
    if (!layerData.length || !xField || !yField) return []

    const groups = new Map<string, number[]>()

    layerData.forEach(row => {
      const xVal = String(row[xField] ?? 'Unknown')
      const yVal = Number(row[yField])
      if (isNaN(yVal)) return
      if (!groups.has(xVal)) groups.set(xVal, [])
      groups.get(xVal)!.push(yVal)
    })

    return Array.from(groups.entries()).map(([x, values]) => ({
      x,
      y: aggregate(values, aggregation),
    }))

  }, [layerData, xField, yField, aggregation])
  //              ↑ primitive values — لو اتغيروا بس يشتغل useMemo
}

function aggregate(values: number[], type: AggregationType): number {
  if (values.length === 0) return 0

  switch (type) {
    case 'sum':   return round(values.reduce((a, b) => a + b, 0))
    case 'avg':   return round(values.reduce((a, b) => a + b, 0) / values.length)
    // ← reduce بدل spread لحماية الـ call stack مع ملفات كبيرة
    case 'min':   return values.reduce((min, p) => p < min ? p : min, values[0])
    case 'max':   return values.reduce((max, p) => p > max ? p : max, values[0])
    case 'count': return values.length
    default:      return 0
  }
}

function round(n: number): number {
  return Math.round(n * 100) / 100
}

// ── detect numeric fields ─────────────────────────────────────────────────────
export function getNumericFields(data: any[]): string[] {
  if (!data.length) return []
  return Object.keys(data[0]).filter(key => {
    const sample = data.slice(0, 10)
    // ← null/undefined check مضاف عشان الـ GeoJSON fields الفاضية
    return sample.every(row =>
      row[key] !== null &&
      row[key] !== undefined &&
      row[key] !== '' &&
      !isNaN(Number(row[key]))
    )
  })
}

// ── detect category fields ────────────────────────────────────────────────────
export function getCategoryFields(data: any[]): string[] {
  if (!data.length) return []
  return Object.keys(data[0]).filter(key => {
    const sample = data.slice(0, 10)
    return sample.some(row => isNaN(Number(row[key])) || row[key] === '')
  })
}