import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import Navbar from '../features/dashboard/components/Navbar'
import TemplateCard from '../features/templates/components/TemplateCard'
import TEMPLATES from '../features/templates/data/sampleTemplates'

const labels = {
  en: {
    back: 'Back to Dashboards',
    title: 'Choose a Template',
    sub: 'Kickstart your project with a pre-built layout or start with a blank canvas.',
    hint: 'Templates are just a starting point — you can rearrange everything inside the builder.',
  },
  ar: {
    back: 'العودة للوحات',
    title: 'اختر قالباً',
    sub: 'ابدأ مشروعك بتخطيط جاهز أو ابدأ من لوحة فارغة.',
    hint: 'القوالب مجرد نقطة بداية — يمكنك إعادة ترتيب كل شيء داخل المحرر.',
  },
}

function TemplatePickerPage() {
  const navigate = useNavigate()
  const { lang } = useTheme()
  const t = labels[lang]

  function handleSelect(id: string) {
    navigate(`/builder/${id}`)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--page-bg)' }}>
      <Navbar showNewButton={false} />

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 32px' }}>

        {/* Back */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            cursor: 'pointer',
            marginBottom: '32px',
            padding: '4px 0',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 12L6 8l4-4"/>
          </svg>
          {t.back}
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            letterSpacing: '-0.5px',
            marginBottom: '12px',
          }}>
            {t.title}
          </h1>
          <p style={{
            fontSize: '15px',
            color: 'var(--text-secondary)',
            maxWidth: '480px',
            margin: '0 auto',
            lineHeight: '1.6',
          }}>
            {t.sub}
          </p>
        </div>

        {/* Templates Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px',
          marginBottom: '32px',
        }}>
          {TEMPLATES.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* Hint */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          padding: '20px 24px',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--accent)" strokeWidth="1.5">
              <circle cx="7" cy="7" r="6"/>
              <path d="M7 6v4M7 4.5v.5"/>
            </svg>
            {t.hint}
          </p>
        </div>

      </main>
    </div>
  )
}

export default TemplatePickerPage