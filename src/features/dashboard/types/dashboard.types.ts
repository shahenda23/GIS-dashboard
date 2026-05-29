export interface Dashboard {
  id: string
  title: string
  description: string
  editedAt: string        
  widgetCount: number
  thumbnailUrl: string    
  status: 'live' | 'draft'
}

