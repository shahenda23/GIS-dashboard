import { useState } from 'react'
import { Dashboard } from '../types/dashboard.types'
import { useTheme } from '../../../context/ThemeContext'

interface DashboardCardProps {
  dashboard: Dashboard & { isPublic?: boolean }
  onOpen:    (id: string) => void
  onShare:   (id: string) => void
  onPreview: (id: string) => void
  onEdit:    (id: string) => void
  onDelete:  (id: string) => void
}

function DashboardPreview({ id }: { id: string }) {
  const tints = ['#eff6ff', '#f0fdf4', '#fefce8', '#fdf4ff', '#fff7ed']
  const hash  = id.split('').reduce((s, c) => s + c.charCodeAt(0), 0)
  const tint  = tints[hash % tints.length]

  return (
    <div style={{ width: '100%', height: '100%', background: tint, borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px' }}>
      <div style={{ display: 'flex', gap: '6px', flex: 2 }}>
        <div style={{ flex: 2, background: '#e2e8f0', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ flex: 1, background: '#e2e8f0', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
          <div style={{ flex: 1, background: '#e2e8f0', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
        <div style={{ flex: 1, background: '#e2e8f0', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <div style={{ flex: 1, background: '#e2e8f0', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
        <div style={{ flex: 1, background: '#e2e8f0', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
      </div>
    </div>
  )
}

function DashboardCard({ dashboard, onShare, onPreview, onEdit, onDelete }: DashboardCardProps) {
  const [hovered, setHovered]             = useState(false)
  const [menuOpen, setMenuOpen]           = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { lang } = useTheme()

  const t = {
    en: { edited: 'Edited', preview: 'Preview', edit: 'Edit', share: 'Share', delete: 'Delete', pub: 'Public', priv: 'Private' },
    ar: { edited: 'عُدِّل', preview: 'معاينة', edit: 'تعديل', share: 'مشاركة', delete: 'حذف', pub: 'عام', priv: 'خاص' },
  }[lang]

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background:   'var(--surface)',
          border:       '1px solid',
          borderColor:  hovered ? 'var(--accent)' : 'var(--border)',
          borderRadius: 'var(--radius-xl)',
          position:     'relative',
          zIndex:       menuOpen ? 50 : 1,
          transition:   'border-color 0.15s, box-shadow 0.15s',
          boxShadow:    hovered ? '0 4px 16px rgba(0,0,0,0.08)' : 'none',
        }}
      >
        {/* Preview area */}
        <div style={{
          height:       '140px',
          background:   '#f8fafc',
          borderBottom: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          padding:      '16px',
          position:     'relative',
          overflow:     'hidden',
        }}>
          <DashboardPreview id={dashboard.id} />

          {/* Widget count badge */}
          <div style={{
            position:      'absolute',
            top:           '10px',
            left:          '10px',
            background:    'rgba(255,255,255,0.88)',
            backdropFilter:'blur(8px)',
            fontSize:      '11px',
            fontWeight:    '600',
            color:         '#374151',
            padding:       '3px 9px',
            borderRadius:  '20px',
            border:        '1px solid rgba(0,0,0,0.06)',
            display:       'flex',
            alignItems:    'center',
            gap:           '4px',
          }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.3">
              <rect x="0.5" y="0.5" width="3.5" height="3.5" rx="0.5"/>
              <rect x="6"   y="0.5" width="3.5" height="3.5" rx="0.5"/>
              <rect x="0.5" y="6"   width="3.5" height="3.5" rx="0.5"/>
              <rect x="6"   y="6"   width="3.5" height="3.5" rx="0.5"/>
            </svg>
            {dashboard.widgetCount}
          </div>

          {/* Hover overlay with actions */}
          <div style={{
            position:   'absolute',
            inset:      0,
            background: 'rgba(15,23,42,0.32)',
            display:    'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap:        '8px',
            opacity:    hovered ? 1 : 0,
            transition: 'opacity 0.15s',
          }}>
            <button
              onClick={e => { e.stopPropagation(); onPreview(dashboard.id) }}
              style={{ padding: '7px 16px', background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: '#1e293b', cursor: 'pointer' }}
            >
              {t.preview}
            </button>
            <button
              onClick={e => { e.stopPropagation(); onEdit(dashboard.id) }}
              style={{ padding: '7px 16px', background: 'var(--accent)', border: 'none', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: '#fff', cursor: 'pointer' }}
            >
              {t.edit}
            </button>
          </div>

          {/* Public badge */}
          {dashboard.isPublic && (
            <div style={{
              position:   'absolute',
              top:        '10px',
              right:      '10px',
              background: 'rgba(240,253,244,0.92)',
              fontSize:   '10px',
              fontWeight: '700',
              color:      '#15803d',
              padding:    '3px 8px',
              borderRadius: '20px',
              border:     '1px solid rgba(34,197,94,0.25)',
            }}>
              {t.pub}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', position: 'relative' }}>
            <p style={{
              fontSize:     '14px',
              fontWeight:   '600',
              color:        'var(--text-primary)',
              margin:       0,
              overflow:     'hidden',
              textOverflow: 'ellipsis',
              whiteSpace:   'nowrap',
              flex:         1,
            }}>
              {dashboard.title}
            </p>

            <button
              onClick={e => { e.stopPropagation(); setMenuOpen(v => !v) }}
              style={{ background: 'transparent', border: 'none', color: '#9ca3af', fontSize: '16px', cursor: 'pointer', padding: '1px 5px', lineHeight: 1, borderRadius: '6px', flexShrink: 0 }}
            >⋮</button>

            {menuOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={() => setMenuOpen(false)} />
                <div style={{
                  position:     'absolute',
                  top:          '100%',
                  ...(lang === 'ar' ? { left: 0 } : { right: 0 }),
                  marginTop:    '4px',
                  background:   '#fff',
                  border:       '1px solid var(--border)',
                  borderRadius: '12px',
                  boxShadow:    '0 8px 32px rgba(0,0,0,0.10)',
                  zIndex:       99,
                  minWidth:     '148px',
                  overflow:     'hidden',
                }}>
                  {[
                    { label: t.preview, icon: <EyeIcon />,   danger: false, action: () => { onPreview(dashboard.id); setMenuOpen(false) } },
                    { label: t.edit,    icon: <PenIcon />,   danger: false, action: () => { onEdit(dashboard.id);    setMenuOpen(false) } },
                    { label: t.share,   icon: <ShareIcon />, danger: false, action: () => { onShare(dashboard.id);   setMenuOpen(false) } },
                    { label: t.delete,  icon: <TrashIcon />, danger: true,  action: () => { setMenuOpen(false); setConfirmDelete(true) } },
                  ].map((item, i, arr) => (
                    <button key={i} onClick={item.action}
                      style={{
                        width:      '100%',
                        padding:    '9px 13px',
                        background: 'transparent',
                        border:     'none',
                        borderTop:  i === arr.length - 1 ? '1px solid var(--border)' : 'none',
                        textAlign:  lang === 'ar' ? 'right' : 'left',
                        fontSize:   '13px',
                        color:      item.danger ? '#ef4444' : 'var(--text-primary)',
                        cursor:     'pointer',
                        display:    'flex',
                        alignItems: 'center',
                        gap:        '8px',
                        transition: 'background 0.12s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = item.danger ? '#fef2f2' : '#f8fafc')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {item.icon}{item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="11" height="11" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.2">
              <rect x="1" y="2" width="11" height="10" rx="1.5"/><path d="M1 5h11"/><path d="M4 1v2M9 1v2"/>
            </svg>
            {t.edited} {dashboard.editedAt}
            {!dashboard.isPublic && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <LockIcon />
                {t.priv}
              </span>
            )}
          </p>
        </div>
      </div>

      {confirmDelete && (
        <div onClick={() => setConfirmDelete(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '380px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h2 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '700', color: '#0f172a' }}>
              {lang === 'ar' ? 'حذف اللوحة؟' : 'Delete Dashboard?'}
            </h2>
            <p style={{ margin: '0 0 22px', color: '#64748b', fontSize: '13px', lineHeight: 1.6 }}>
              {lang === 'ar'
                ? `هل أنت متأكد من حذف "${dashboard.title}"؟`
                : `Delete "${dashboard.title}"? This cannot be undone.`}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setConfirmDelete(false)}
                style={{ flex: 1, padding: '9px', background: 'transparent', border: '1px solid var(--border)', borderRadius: '9px', cursor: 'pointer', fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button onClick={() => { setConfirmDelete(false); onDelete(dashboard.id) }}
                style={{ flex: 1, padding: '9px', background: '#ef4444', border: 'none', borderRadius: '9px', cursor: 'pointer', fontSize: '13px', color: '#fff', fontWeight: '600' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#dc2626')}
                onMouseLeave={e => (e.currentTarget.style.background = '#ef4444')}
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

function EyeIcon()   { return <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 7s2.5-4.5 6-4.5S13 7 13 7s-2.5 4.5-6 4.5S1 7 1 7z"/><circle cx="7" cy="7" r="1.5"/></svg> }
function PenIcon()   { return <svg width="12" height="12" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 2l2 2-7 7H2v-2l7-7z"/></svg> }
function ShareIcon() { return <svg width="12" height="12" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10.5" cy="2.5" r="1.5"/><circle cx="10.5" cy="10.5" r="1.5"/><circle cx="2.5" cy="6.5" r="1.5"/><line x1="4" y1="6" x2="9" y2="3"/><line x1="4" y1="7" x2="9" y2="10"/></svg> }
function TrashIcon() { return <svg width="12" height="12" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="1 3 12 3"/><path d="M4 3V2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1"/><path d="M2 3l.7 8a1 1 0 0 0 1 .9h5.6a1 1 0 0 0 1-.9L11 3"/></svg> }
function LockIcon()  { return <svg width="10" height="10" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="3" y="6" width="7" height="6" rx="1"/><path d="M5 6V4a2 2 0 0 1 4 0v2"/></svg> }

export default DashboardCard
