export interface Template {
  id: string
  name: { en: string; ar: string }
  description: { en: string; ar: string }
  icon: string
  layout: 'blank' | 'urban' | 'field' | 'environmental' | 'infrastructure'
}