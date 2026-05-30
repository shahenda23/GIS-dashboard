import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useTheme } from '../../../context/ThemeContext'

function UserMenu() {
  const { user, signOut } = useAuth()
  const { lang }          = useTheme()
  const navigate          = useNavigate()
  const [open, setOpen]   = useState(false)
  const ref               = useRef<HTMLDivElement>(null)

  // close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function getInitials(email: string): string {
    return email.slice(0, 2).toUpperCase()
  }

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  if (!user) return null

  const t = {
    en: { plan: 'Free Plan', dashboards: 'My Dashboards', templates: 'Templates', signout: 'Sign Out' },
    ar: { plan: 'الخطة المجانية', dashboards: 'لوحاتي', templates: 'القوالب', signout: 'تسجيل الخروج' },
  }[lang]

  return (
    <div ref={ref} style={{ position: 'relative' }}>

      {/* Avatar button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: '#fff',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.15s, box-shadow 0.15s',
          flexShrink: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.05)'
          e.currentTarget.style.boxShadow = '0 0 0 3px var(--accent-light, rgba(14,165,233,0.2))'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="7.5" r="3.2" fill="#111"/>
          <circle cx="10" cy="7.5" r="5.5" stroke="var(--accent)" strokeWidth="1" fill="none"/>
          <path d="M2 18.5c0-4.142 3.582-7.5 8-7.5s8 3.358 8 7.5" stroke="#111" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          [lang === 'ar' ? 'left' : 'right']: 0,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          minWidth: '220px',
          overflow: 'hidden',
          zIndex: 200,
        }}>

          {/* User info */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px',
                borderRadius: '50%',
                background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="7.5" r="3.2" fill="#111"/>
                  <circle cx="10" cy="7.5" r="5.5" stroke="var(--accent)" strokeWidth="1" fill="none"/>
                  <path d="M2 18.5c0-4.142 3.582-7.5 8-7.5s8 3.358 8 7.5" stroke="#111" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <p style={{
                  fontSize: '13px', fontWeight: '600',
                  color: 'var(--text-primary)', margin: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {user.email}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                  {t.plan}
                </p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <div style={{ padding: '6px' }}>

            {/* My Dashboards */}
            <MenuItem
              icon={
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="1" width="5" height="5" rx="1"/>
                  <rect x="9" y="1" width="5" height="5" rx="1"/>
                  <rect x="1" y="9" width="5" height="5" rx="1"/>
                  <rect x="9" y="9" width="5" height="5" rx="1"/>
                </svg>
              }
              label={t.dashboards}
              onClick={() => { navigate('/'); setOpen(false) }}
            />

            {/* Templates */}
            <MenuItem
              icon={
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="1" width="13" height="9" rx="1"/>
                  <path d="M4 13h7M7.5 10v3"/>
                </svg>
              }
              label={t.templates}
              onClick={() => { navigate('/templates'); setOpen(false) }}
            />

            <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />

            {/* Sign out */}
            <MenuItem
              icon={
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 13H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3"/>
                  <path d="M10 10l3-3-3-3"/>
                  <path d="M13 7H6"/>
                </svg>
              }
              label={t.signout}
              onClick={handleSignOut}
              danger
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Helper component ──────────────────────────────────────────────────────────
interface MenuItemProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}

function MenuItem({ icon, label, onClick, danger = false }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        padding: '8px 10px',
        background: 'transparent',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '13px',
        color: danger ? '#ef4444' : 'var(--text-primary)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? '#fef2f2' : 'var(--page-bg)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {icon}
      {label}
    </button>
  )
}

export default UserMenu