import { Dashboard } from '../types/dashboard.types'

const SAMPLE_DASHBOARDS: Dashboard[] = [
  {
    id: '1',
    title: 'Cairo Urban Planning',
    description: 'Land use zones and population density',
    editedAt: '2 days ago',
    widgetCount: 4,
    thumbnailUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80',
    status: 'live',
  },
  {
    id: '2',
    title: 'Field Survey Q1 2024',
    description: 'Ground truth data collection results',
    editedAt: '5 days ago',
    widgetCount: 3,
    thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80',
    status: 'live',
  },
  {
    id: '3',
    title: 'Nile Delta Environment',
    description: 'Environmental monitoring and water levels',
    editedAt: '1 week ago',
    widgetCount: 5,
    thumbnailUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
    status: 'live',
  },
]

export default SAMPLE_DASHBOARDS