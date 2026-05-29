import { Template } from '../types/template.types'

const TEMPLATES: Template[] = [
  {
    id: 'blank',
    name: { en: 'Blank Canvas', ar: 'لوحة فارغة' },
    description: {
      en: 'Start from scratch with a clean slate. Perfect for custom grid arrangements.',
      ar: 'ابدأ من الصفر. مثالي للتخطيطات المخصصة.',
    },
    icon: '+',
    layout: 'blank',
  },
  {
    id: 'urban',
    name: { en: 'Urban Planning', ar: 'التخطيط العمراني' },
    description: {
      en: 'A map-centric layout optimized for city zoning, development, and parcel data.',
      ar: 'تخطيط مرتكز على الخريطة لتقسيم المدن والتطوير.',
    },
    icon: '🏙',
    layout: 'urban',
  },
  {
    id: 'field',
    name: { en: 'Field Survey', ar: 'المسح الميداني' },
    description: {
      en: 'Designed for data collection and inspection forms alongside a reference map.',
      ar: 'مصمم لجمع البيانات الميدانية جانب خريطة مرجعية.',
    },
    icon: '📋',
    layout: 'field',
  },
  {
    id: 'environmental',
    name: { en: 'Environmental Monitoring', ar: 'الرصد البيئي' },
    description: {
      en: 'Highlight sensor data and trends with chart-heavy widgets.',
      ar: 'إبراز بيانات المستشعرات والاتجاهات البيئية.',
    },
    icon: '🌿',
    layout: 'environmental',
  },
  {
    id: 'infrastructure',
    name: { en: 'Infrastructure Grid', ar: 'شبكة البنية التحتية' },
    description: {
      en: 'A complex grid for managing assets, utility networks, and maintenance logs.',
      ar: 'شبكة متكاملة لإدارة الأصول وشبكات المرافق.',
    },
    icon: '🏗',
    layout: 'infrastructure',
  },
]

export default TEMPLATES