import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Navbar from '../features/dashboard/components/Navbar'
import DashboardCard from '../features/dashboard/components/DashboardCard'
import ShareModal from '../features/dashboard/components/ShareModal'
import Footer from '../features/dashboard/components/Footer'
import AppLoader from '../components/AppLoader'

function timeAgo(dateStr: string, lang: 'en' | 'ar'): string {
  const diff  = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  < 1)  return lang === 'en' ? 'just now'      : 'الآن'
  if (mins  < 60) return lang === 'en' ? `${mins}m ago`  : `منذ ${mins} د`
  if (hours < 24) return lang === 'en' ? `${hours}h ago` : `منذ ${hours} س`
  return lang === 'en' ? `${days}d ago` : `منذ ${days} ي`
}

function getGreeting(lang: 'en' | 'ar', name: string): string {
  const h = new Date().getHours()
  if (lang === 'ar') {
    const g = h < 12 ? 'صباح الخير' : h < 17 ? 'مساء الخير' : 'مساء النور'
    return name ? `${g}، ${name}` : g
  }
  const g = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
  return name ? `${g}, ${name}` : g
}

function HomePage() {
  const navigate = useNavigate()
  const { lang } = useTheme()
  const { user }  = useAuth()
  const [dashboards,   setDashboards]   = useState<any[]>([])
  const [loading,      setLoading]      = useState(true)
  const [shareModalId, setShareModalId] = useState<string | null>(null)

  const name     = user?.user_metadata?.full_name || user?.email?.split('@')[0] || ''
  const greeting = getGreeting(lang, name)

  useEffect(() => {
    if (!user) return
    supabase
      .from('dashboards')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setDashboards(data)
        setLoading(false)
      })
  }, [user])

  async function handleDelete(id: string) {
    await supabase.from('dashboards').delete().eq('id', id)
    setDashboards(prev => prev.filter(d => d.id !== id))
  }

  const t = {
    en: {
      countLine: (n: number) =>
        n === 0 ? 'Your workspace is empty — create your first dashboard'
                : `You have ${n} dashboard${n !== 1 ? 's' : ''} in your workspace`,
      newBtn:  '+ New Dashboard',
      section: 'Workspace',
      newCard: 'New Dashboard',
      newSub:  'Start from a template or blank canvas',
    },
    ar: {
      countLine: (n: number) =>
        n === 0 ? 'مساحة العمل فارغة — أنشئ أول لوحة تحكم'
                : `لديك ${n} لوحة تحكم في مساحة العمل`,
      newBtn:  '+ لوحة جديدة',
      section: 'مساحة العمل',
      newCard: 'لوحة جديدة',
      newSub:  'ابدأ من قالب أو لوحة فارغة',
    },
  }[lang]

  if (loading) return <AppLoader />

  return (
    <div style={{
      minHeight:       '100vh',
      display:         'flex',
      flexDirection:   'column',
      background:      '#f1f5f9',
      backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
      backgroundSize:  '22px 22px',
      direction:       lang === 'ar' ? 'rtl' : 'ltr',
    }}>

      {/* ── Navbar: أبيض full-width، sticky، rounded أسفل بس ── */}
      <Navbar activeTab="dashboards" />

      {/* ── Main content: بيتسكرول عادي مع الـ body ── */}
      <main style={{
        flex:     1,
        maxWidth: '1300px',
        width:    '100%',
        margin:   '0 auto',
        padding:  '4px 40px 64px',
      }}>

          {/* ── Greeting ── */}
          <div style={{
            padding:        '40px 0 44px',
            display:        'flex',
            alignItems:     'flex-end',
            justifyContent: 'space-between',
            gap:            '24px',
            flexWrap:       'wrap',
          }}>
            <div>
              <p style={{
                fontSize:    '13px',
                color:       '#94a3b8',
                margin:      '0 0 10px',
                fontWeight:  '500',
                letterSpacing: '0.1px',
              }}>
                {greeting}
              </p>
              <h1 style={{
                fontSize:      '28px',
                fontWeight:    '700',
                color:         '#0f172a',
                margin:        '0',
                letterSpacing: '-0.5px',
                lineHeight:    1.2,
              }}>
                {t.countLine(dashboards.length)}
              </h1>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate('/templates')}
              style={{
                padding:      '9px 20px',
                background:   '#0ea5e9',
                border:       'none',
                borderRadius: '40px',
                fontSize:     '13px',
                fontWeight:   '600',
                color:        '#fff',
                cursor:       'pointer',
                boxShadow:    '0 2px 12px rgba(14,165,233,0.28)',
                transition:   'background 0.15s, transform 0.12s',
                display:      'flex',
                alignItems:   'center',
                gap:          '6px',
                flexShrink:   0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0284c7'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0ea5e9'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M6.5 1v11M1 6.5h11"/>
              </svg>
              {t.newBtn}
            </button>
          </div>

          {/* ── Section label ── */}
          <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              fontSize:      '12px',
              fontWeight:    '600',
              color:         '#94a3b8',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
            }}>
              {t.section}
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(203,213,225,0.6)' }} />
          </div>

          {/* ── Cards grid ── */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(265px, 1fr))',
            gap:                 '16px',
          }}>

            {/* New dashboard card */}
            <div
              onClick={() => navigate('/templates')}
              style={{
                background:     'rgba(255,255,255,0.70)',
                border:         '1.5px dashed #cbd5e1',
                borderRadius:   '14px',
                minHeight:      '228px',
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            '10px',
                cursor:         'pointer',
                transition:     'border-color 0.2s, background 0.2s, transform 0.18s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#0ea5e9'
                e.currentTarget.style.background  = 'rgba(240,249,255,0.85)'
                e.currentTarget.style.transform   = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#cbd5e1'
                e.currentTarget.style.background  = 'rgba(255,255,255,0.70)'
                e.currentTarget.style.transform   = 'translateY(0)'
              }}
            >
              <div style={{
                width:        '42px',
                height:       '42px',
                borderRadius: '12px',
                background:   'rgba(255,255,255,0.88)',
                border:       '1px solid #e2e8f0',
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'center',
                color:        '#94a3b8',
              }}>
                <svg width="18" height="18" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M6.5 1v11M1 6.5h11"/>
                </svg>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '13px', fontWeight: '600', color: '#374151', margin: '0 0 4px' }}>{t.newCard}</p>
                <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>{t.newSub}</p>
              </div>
            </div>

            {/* Dashboard cards */}
            {dashboards.map(d => (
              <DashboardCard
                key={d.id}
                dashboard={{
                  id:           d.id,
                  title:        d.title,
                  description:  '',
                  editedAt:     timeAgo(d.updated_at, lang),
                  widgetCount:  d.widgets?.length ?? 0,
                  thumbnailUrl: '',
                  status:       'live',
                  isPublic:     d.is_public,
                }}
                onOpen={   id => navigate(`/builder/${id}`)}
                onEdit={   id => navigate(`/builder/${id}`)}
                onPreview={ id => navigate(`/dashboard/${id}`)}
                onShare={  id => setShareModalId(id)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </main>

      {shareModalId && (
        <ShareModal dashboardId={shareModalId} onClose={() => setShareModalId(null)} />
      )}

      {/* ── Footer ── */}
      <Footer />

    </div>
  )
}

export default HomePage