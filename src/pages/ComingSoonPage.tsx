import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const pageContent = {
  '/docs': {
    en: { label: 'Documentation', title: 'Docs are on their way', sub: 'We are writing clear, detailed guides to help you get the most out of GIS Dashboard Builder.' },
    ar: { label: 'التوثيق', title: 'التوثيق قادم قريباً', sub: 'نكتب أدلة تفصيلية لمساعدتك في الاستفادة القصوى من المنصة.' },
  },
  '/api': {
    en: { label: 'API', title: 'API reference coming soon', sub: 'Full REST API access with authentication, endpoints, and code examples for every feature.' },
    ar: { label: 'واجهة برمجية', title: 'مرجع الـ API قادم قريباً', sub: 'وصول كامل لـ REST API مع مصادقة ونقاط نهاية وأمثلة برمجية لكل ميزة.' },
  },
  '/community': {
    en: { label: 'Community', title: 'Community is being built', sub: 'A space for GIS professionals to share dashboards, templates, and ideas with each other.' },
    ar: { label: 'المجتمع', title: 'المجتمع قيد الإنشاء', sub: 'مساحة لمتخصصي GIS لمشاركة اللوحات والقوالب والأفكار.' },
  },
  '/help-center': {
    en: { label: 'Help Center', title: 'Help Center is on its way', sub: 'Step-by-step guides, FAQs, and video tutorials to help you build powerful GIS dashboards.' },
    ar: { label: 'مركز المساعدة', title: 'مركز المساعدة قادم قريباً', sub: 'أدلة خطوة بخطوة وأسئلة شائعة ودروس فيديو لمساعدتك في بناء لوحات GIS احترافية.' },
  },
}

const features = {
  en: ['Interactive tutorials', 'Video walkthroughs', 'API playground', 'Community templates', 'Live examples'],
  ar: ['دروس تفاعلية', 'شروحات فيديو', 'ملعب API', 'قوالب مجتمعية', 'أمثلة حية'],
}

function ComingSoonPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { lang } = useTheme()

  const content = pageContent[location.pathname as keyof typeof pageContent]
    ?? pageContent['/docs']
  const t = content[lang]
  const f = features[lang]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--page-bg)',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* Top bar */}
      <div style={{
        height: '52px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px',
        gap: '12px',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: 'var(--radius-md)',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--page-bg)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }}>
            <path d="M10 12L6 8l4-4"/>
          </svg>
          {lang === 'en' ? 'Back to Home' : 'العودة للرئيسية'}
        </button>

        <span style={{ color: 'var(--border)', fontSize: '16px' }}>|</span>

        <span style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
        }}>
          {t.label}
        </span>
      </div>

      {/* Main */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 32px',
        textAlign: 'center',
      }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'var(--accent-light)',
          border: '1px solid var(--accent)',
          color: 'var(--accent)',
          fontSize: '11px',
          fontWeight: '600',
          padding: '4px 12px',
          borderRadius: '20px',
          letterSpacing: '0.5px',
          marginBottom: '24px',
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: 'var(--accent)',
          }} />
          {lang === 'en' ? 'COMING SOON' : 'قريباً'}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '40px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          letterSpacing: '-0.8px',
          marginBottom: '16px',
          maxWidth: '520px',
          lineHeight: '1.2',
        }}>
          {t.title}
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '15px',
          color: 'var(--text-secondary)',
          maxWidth: '440px',
          lineHeight: '1.7',
          marginBottom: '48px',
        }}>
          {t.sub}
        </p>

        {/* Feature list */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '48px',
          maxWidth: '480px',
        }}>
          {f.map(feature => (
            <div key={feature} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              color: 'var(--text-secondary)',
            }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--accent)" strokeWidth="2">
                <polyline points="2 6 5 9 10 3"/>
              </svg>
              {feature}
            </div>
          ))}
        </div>

        {/* Notify form */}
        <div style={{
          display: 'flex',
          gap: '8px',
          width: '100%',
          maxWidth: '380px',
          marginBottom: '32px',
        }}>
          <input
            type="email"
            placeholder={lang === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
            style={{
              flex: 1,
              height: '38px',
              padding: '0 14px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              color: 'var(--text-primary)',
              background: 'var(--surface)',
              outline: 'none',
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
          />
          <button style={{
            height: '38px',
            padding: '0 18px',
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--accent)'}
          >
            {lang === 'en' ? 'Notify me' : 'أبلغني'}
          </button>
        </div>

        <p style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
        }}>
          {lang === 'en'
            ? 'No spam. We will notify you once it is ready.'
            : 'لا رسائل مزعجة. سنبلغك عند الاستعداد.'}
        </p>
      </div>
    </div>
  )
}

export default ComingSoonPage