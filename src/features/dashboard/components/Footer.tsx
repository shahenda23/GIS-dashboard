import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../../context/ThemeContext'

function Footer() {
  const navigate = useNavigate()
  const { lang } = useTheme()

  const productLinks = {
    en: [
      { label: 'Templates', path: '/templates' },
      { label: 'API', path: '/api' },
    ],
    ar: [
      { label: 'القوالب', path: '/templates' },
      { label: 'API', path: '/api' },
    ],
  }

  const supportLinks = {
    en: [
      { label: 'Documentation', path: '/docs' },
      { label: 'Community',     path: '/community' },
      { label: 'Help Center',   path: '/help-center' },
    ],
    ar: [
      { label: 'التوثيق',       path: '/docs' },
      { label: 'المجتمع',       path: '/community' },
      { label: 'مركز المساعدة', path: '/help-center' },
    ],
  }

  const t = {
    en: {
      description: 'Professional geospatial visualization tools for data-driven decisions.',
      product: 'Product',
      support: 'Support',
      rights: '© 2024 GIS Dashboard Builder. All rights reserved.',
    },
    ar: {
      description: 'أدوات احترافية للتصور الجغرافي لاتخاذ قرارات مبنية على البيانات.',
      product: 'المنتج',
      support: 'الدعم',
      rights: '© 2024 GIS Dashboard Builder. جميع الحقوق محفوظة.',
    },
  }[lang]

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--surface)',
      padding: '40px 32px',
      marginTop: '48px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: '32px',
      }}>

        {/* Brand */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px',
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              background: 'var(--accent)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
            }}>
              G
            </div>
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-primary)',
            }}>
              GIS Dashboard Builder
            </span>
          </div>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6',
            maxWidth: '220px',
          }}>
            {t.description}
          </p>
        </div>

        {/* Product */}
        <div>
          <p style={{
            fontSize: '11px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}>
            {t.product}
          </p>
          {productLinks[lang].map(item => (
            <p
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                marginBottom: '10px',
                cursor: 'pointer',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              {item.label}
            </p>
          ))}
        </div>

        {/* Support */}
        <div>
          <p style={{
            fontSize: '11px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
            marginBottom: '14px',
          }}>
            {t.support}
          </p>
          {supportLinks[lang].map(item => (
            <p
              key={item.label}
              onClick={() => navigate(item.path)}
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                marginBottom: '10px',
                cursor: 'pointer',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              {item.label}
            </p>
          ))}
        </div>

        {/* Copyright */}
        <div style={{ textAlign: lang === 'ar' ? 'left' : 'right' }}>
          <p style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginBottom: '16px',
            lineHeight: '1.6',
          }}>
            {t.rights}
          </p>
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: lang === 'ar' ? 'flex-start' : 'flex-end',
          }}>
            <svg
              width="18" height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="1.8"
              style={{ cursor: 'pointer' }}
            >
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <svg
              width="18" height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="1.8"
              style={{ cursor: 'pointer' }}
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer