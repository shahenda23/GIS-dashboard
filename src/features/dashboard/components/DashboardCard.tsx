import { useState } from 'react'
import { Dashboard } from '../types/dashboard.types'
import { useTheme } from '../../../context/ThemeContext'

interface DashboardCardProps {
  dashboard: Dashboard
  onOpen: (id: string) => void
  onShare: (id: string) => void
  onPreview: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

function DashboardCard({ dashboard, onOpen, onShare, onPreview, onEdit, onDelete }: DashboardCardProps) {
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { lang } = useTheme()

  const t = {
    en: {
      widgets: 'Widgets', edited: 'Edited', status: 'STATUS',
      preview: 'Preview', edit: 'Edit', share: 'Share', delete: 'Delete',
    },
    ar: {
      widgets: 'ودجت', edited: 'عُدِّل', status: 'الحالة',
      preview: 'معاينة', edit: 'تعديل', share: 'مشاركة', delete: 'حذف',
    },
  }[lang]

  const menuItems = [
    {
      label: t.preview,
      icon: (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M1 6.5s2.2-4 5.5-4 5.5 4 5.5 4-2.2 4-5.5 4-5.5-4-5.5-4z"/>
          <circle cx="6.5" cy="6.5" r="1.5"/>
        </svg>
      ),
      onClick: () => { onPreview(dashboard.id); setMenuOpen(false) },
      color: 'var(--text-primary)',
      hover: 'var(--page-bg)',
    },
    {
      label: t.edit,
      icon: (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 2l2 2-7 7H2v-2l7-7z"/>
        </svg>
      ),
      onClick: () => { onEdit(dashboard.id); setMenuOpen(false) },
      color: 'var(--text-primary)',
      hover: 'var(--page-bg)',
    },
    {
      label: t.share,
      icon: (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="10.5" cy="2.5" r="1.5"/>
          <circle cx="10.5" cy="10.5" r="1.5"/>
          <circle cx="2.5" cy="6.5" r="1.5"/>
          <line x1="4" y1="6" x2="9" y2="3"/>
          <line x1="4" y1="7" x2="9" y2="10"/>
        </svg>
      ),
      onClick: () => { onShare(dashboard.id); setMenuOpen(false) },
      color: 'var(--text-primary)',
      hover: 'var(--page-bg)',
    },
    {
      label: t.delete,
      icon: (
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="1 3 12 3"/>
          <path d="M4 3V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1"/>
          <path d="M2 3l.7 8a1 1 0 0 0 1 .9h5.6a1 1 0 0 0 1-.9L11 3"/>
        </svg>
      ),
      onClick: () => { setMenuOpen(false); setConfirmDelete(true) },
      color: '#ef4444',
      hover: '#fef2f2',
    },
  ]

  return (
    <>
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        transition: 'box-shadow 0.15s',
        boxShadow: hovered ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Thumbnail */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: '160px', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }}>
        <img
          src={dashboard.thumbnailUrl}
          alt={dashboard.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* Widget count badge */}
        <div style={{
          position: 'absolute', top: '10px', right: '10px',
          background: 'rgba(255,255,255,0.92)', color: 'var(--text-primary)',
          fontSize: '11px', fontWeight: '500', padding: '4px 10px',
          borderRadius: '20px', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: '5px',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="0.5" y="0.5" width="4.5" height="4.5" rx="0.5" stroke="currentColor"/>
            <rect x="7" y="0.5" width="4.5" height="4.5" rx="0.5" stroke="currentColor"/>
            <rect x="0.5" y="7" width="4.5" height="4.5" rx="0.5" stroke="currentColor"/>
            <rect x="7" y="7" width="4.5" height="4.5" rx="0.5" stroke="currentColor"/>
          </svg>
          {dashboard.widgetCount} {t.widgets}
        </div>

        {/* Hover overlay — subtle dark only, no buttons */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(17,24,39,0.35)',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.2s',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>

        {/* Title + dots menu */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
          <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
            {dashboard.title}
          </p>

          <button
            onClick={e => { e.stopPropagation(); setMenuOpen(v => !v) }}
            style={{
              background: menuOpen ? 'var(--page-bg)' : 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '0 4px',
              lineHeight: 1,
              borderRadius: 'var(--radius-sm)',
            }}
          >
            ⋮
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <>
              {/* backdrop */}
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 98 }}
                onClick={() => setMenuOpen(false)}
              />
              <div style={{
                position: 'absolute', top: '100%', right: 0,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                zIndex: 99, minWidth: '148px', overflow: 'hidden',
              }}>
                {menuItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={item.onClick}
                    style={{
                      width: '100%', padding: '8px 12px',
                      background: 'transparent', border: 'none',
                      borderTop: i === menuItems.length - 1 ? '1px solid var(--border)' : 'none',
                      textAlign: lang === 'ar' ? 'right' : 'left',
                      fontSize: '13px', color: item.color,
                      cursor: 'pointer', display: 'flex', alignItems: 'center',
                      gap: '8px', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = item.hover}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Edited at */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '12px' }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2">
            <rect x="1" y="2" width="11" height="10" rx="1.5"/>
            <path d="M1 5h11"/>
            <path d="M4 1v2M9 1v2"/>
          </svg>
          {t.edited} {dashboard.editedAt}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />

        {/* Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
          <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '0.4px' }}>
            {t.status}: {dashboard.status.toUpperCase()}
          </span>
        </div>

      </div>
    </div>

    {confirmDelete && (
      <div
        onClick={() => setConfirmDelete(false)}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            backgroundColor: '#ffffff', borderRadius: '16px',
            padding: '32px', width: '400px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
          }}
        >
          <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>
            {lang === 'ar' ? 'حذف اللوحة؟' : 'Delete Dashboard?'}
          </h2>
          <p style={{ margin: '0 0 24px 0', color: '#888', fontSize: '13px', lineHeight: '1.6' }}>
            {lang === 'ar'
              ? `هل أنت متأكد من حذف "${dashboard.title}"؟ لا يمكن التراجع عن هذا الإجراء.`
              : `Are you sure you want to delete "${dashboard.title}"? This action cannot be undone.`}
          </p>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setConfirmDelete(false)}
              style={{
                flex: 1, padding: '10px',
                background: 'transparent', border: '1px solid #ddd',
                borderRadius: '8px', cursor: 'pointer',
                fontSize: '13px', color: '#888', fontWeight: '500',
              }}
            >
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              onClick={() => { setConfirmDelete(false); onDelete(dashboard.id) }}
              style={{
                flex: 1, padding: '10px',
                background: '#ef4444', border: 'none',
                borderRadius: '8px', cursor: 'pointer',
                fontSize: '13px', color: '#fff', fontWeight: '600',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
              onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}
            >
              {lang === 'ar' ? 'حذف' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

export default DashboardCard
