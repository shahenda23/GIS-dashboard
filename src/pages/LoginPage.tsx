import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useTheme } from '../context/ThemeContext'
import logoUrl from '../assets/logo.svg'

function LoginPage() {
  const { lang } = useTheme()
  const navigate  = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [success,  setSuccess]  = useState<string | null>(null)

  const t = {
    en: {
      title: 'Welcome back', titleUp: 'Create your account',
      sub:   'Sign in to manage your GIS dashboards',
      subUp: 'Start building interactive GIS dashboards',
      email: 'Email address', pass: 'Password',
      signin: 'Sign In', signup: 'Create Account',
      noAcc: "Don't have an account?", hasAcc: 'Already have an account?',
      signupLink: 'Sign up', signinLink: 'Sign in',
      checkEmail: 'Check your email to confirm your account!',
      tagline: 'The modern GIS dashboard builder',
    },
    ar: {
      title: 'مرحباً بعودتك', titleUp: 'إنشاء حساب جديد',
      sub:   'سجّل دخولك لإدارة لوحات GIS',
      subUp: 'ابدأ في بناء لوحات GIS تفاعلية',
      email: 'البريد الإلكتروني', pass: 'كلمة المرور',
      signin: 'تسجيل الدخول', signup: 'إنشاء حساب',
      noAcc: 'ليس لديك حساب؟', hasAcc: 'لديك حساب بالفعل؟',
      signupLink: 'سجّل الآن', signinLink: 'سجّل دخولك',
      checkEmail: 'تحقق من بريدك الإلكتروني لتأكيد حسابك!',
      tagline: 'منصة GIS الأكثر تطوراً',
    },
  }[lang]

  async function handleSubmit() {
    if (!email || !password) return
    setLoading(true); setError(null); setSuccess(null)
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setSuccess(t.checkEmail)
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else navigate('/')
    }
    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', direction: lang === 'ar' ? 'rtl' : 'ltr' }}>
      <style>{`
        /* ── floating animations ── */
        @keyframes lp-float-a {
          0%,100% { transform: translateY(0px)   }
          50%      { transform: translateY(-10px) }
        }
        @keyframes lp-float-b {
          0%,100% { transform: translateY(-6px) }
          50%      { transform: translateY(8px)  }
        }
        @keyframes lp-float-c {
          0%,100% { transform: translateY(4px)  }
          50%      { transform: translateY(-8px) }
        }

        /* ── cursor path ── 22s loop ── */
        @keyframes lp-cursor {
          0%        { transform: translate(160px,  60px); opacity: 0  }
          4%        { transform: translate(160px,  60px); opacity: 1  }
          18%       { transform: translate(380px, 110px)              } /* → bar chart */
          22%       { transform: translate(380px, 110px)              } /* hover */
          36%       { transform: translate(220px, 230px)              } /* drag bar  */
          40%       { transform: translate(220px, 230px)              } /* drop      */
          54%       { transform: translate(90px,  380px)              } /* → KPI     */
          58%       { transform: translate(90px,  380px)              } /* hover     */
          72%       { transform: translate(280px, 330px)              } /* drag KPI  */
          76%       { transform: translate(280px, 330px)              } /* drop      */
          88%       { transform: translate(160px,  60px); opacity: 1  } /* return    */
          95%       { transform: translate(160px,  60px); opacity: 0  }
          100%      { transform: translate(160px,  60px); opacity: 0  }
        }

        /* ── cursor click shrink ── */
        @keyframes lp-click {
          0%,20%,24%,56%,60%,100% { transform: scale(1)    }
          22%,58%                  { transform: scale(0.80) }
        }

        /* ── bar chart drag ── */
        @keyframes lp-bar-drag {
          0%,21%  { transform: translate(0,0) scale(1);
                    box-shadow: 0 4px 18px rgba(0,0,0,0.07) }
          22%     { transform: translate(0,0) scale(1.05);
                    box-shadow: 0 0 0 2.5px rgba(14,165,233,.4), 0 14px 36px rgba(14,165,233,.22) }
          36%     { transform: translate(-160px,120px) scale(1.05);
                    box-shadow: 0 0 0 2.5px rgba(14,165,233,.4), 0 18px 44px rgba(14,165,233,.28) }
          40%     { transform: translate(-160px,120px) scale(1);
                    box-shadow: 0 4px 18px rgba(0,0,0,0.07) }
          /* stays until cursor comes back */
          86%     { transform: translate(-160px,120px) scale(1);
                    box-shadow: 0 4px 18px rgba(0,0,0,0.07) }
          87%     { transform: translate(-160px,120px) scale(1.05);
                    box-shadow: 0 0 0 2.5px rgba(14,165,233,.4), 0 14px 36px rgba(14,165,233,.22) }
          95%     { transform: translate(0,0) scale(1.05);
                    box-shadow: 0 0 0 2.5px rgba(14,165,233,.4), 0 14px 36px rgba(14,165,233,.22) }
          97%     { transform: translate(0,0) scale(1);
                    box-shadow: 0 4px 18px rgba(0,0,0,0.07) }
          100%    { transform: translate(0,0) scale(1);
                    box-shadow: 0 4px 18px rgba(0,0,0,0.07) }
        }

        /* ── KPI drag ── */
        @keyframes lp-kpi-drag {
          0%,57%  { transform: translate(0,0) scale(1);
                    box-shadow: 0 4px 18px rgba(0,0,0,0.07) }
          58%     { transform: translate(0,0) scale(1.06);
                    box-shadow: 0 0 0 2.5px rgba(14,165,233,.4), 0 14px 36px rgba(14,165,233,.22) }
          72%     { transform: translate(190px,-50px) scale(1.06);
                    box-shadow: 0 0 0 2.5px rgba(14,165,233,.4), 0 18px 44px rgba(14,165,233,.28) }
          76%     { transform: translate(190px,-50px) scale(1);
                    box-shadow: 0 4px 18px rgba(0,0,0,0.07) }
          96%     { transform: translate(190px,-50px) scale(1) }
          97%     { transform: translate(0,0) scale(1) }
          100%    { transform: translate(0,0) scale(1) }
        }

        /* ── form slide in ── */
        @keyframes lp-form-in {
          from { opacity:0; transform: translateX(-24px) }
          to   { opacity:1; transform: translateX(0) }
        }

        /* ── subtle bar chart bars shimmer ── */
        @keyframes lp-bar-shimmer {
          0%,100% { opacity:.85 }
          50%      { opacity:1   }
        }

        /* ── grid lines pulse ── */
        @keyframes lp-grid-pulse {
          0%,100% { opacity:.55 }
          50%      { opacity:.75 }
        }
      `}</style>

      {/* ════════════════════════════════
          LEFT — login form
      ════════════════════════════════ */}
      <div style={{
        width: '440px',
        flexShrink: 0,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '52px 48px',
        position: 'relative',
        zIndex: 10,
        boxShadow: lang === 'ar'
          ? '-4px 0 48px rgba(0,0,0,0.08)'
          :  '4px 0 48px rgba(0,0,0,0.08)',
        animation: 'lp-form-in 0.7s ease both',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '52px' }}>
          <img src={logoUrl} alt="logo" style={{ width: '36px', height: '36px', borderRadius: '10px' }} />
          <span style={{ fontSize: '15px', fontWeight: '700', color: '#111827', letterSpacing: '-0.2px' }}>
            GIS Dashboard Builder
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', margin: '0 0 8px', letterSpacing: '-0.6px', lineHeight: 1.2 }}>
          {isSignUp ? t.titleUp : t.title}
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 36px', lineHeight: 1.6 }}>
          {isSignUp ? t.subUp : t.sub}
        </p>

        {/* Email */}
        <div style={{ marginBottom: '14px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6b7280', marginBottom: '6px', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
            {t.email}
          </label>
          <input
            type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', color: '#111827', background: '#f9fafb', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box' }}
            onFocus={e => e.currentTarget.style.borderColor = '#0ea5e9'}
            onBlur={e =>  e.currentTarget.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6b7280', marginBottom: '6px', letterSpacing: '0.6px', textTransform: 'uppercase' }}>
            {t.pass}
          </label>
          <input
            type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••"
            style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', color: '#111827', background: '#f9fafb', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box' }}
            onFocus={e => e.currentTarget.style.borderColor = '#0ea5e9'}
            onBlur={e =>  e.currentTarget.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* Error / Success */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#ef4444', marginBottom: '14px' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#16a34a', marginBottom: '14px' }}>
            {success}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          style={{
            width: '100%', padding: '13px',
            background: 'linear-gradient(135deg,#0ea5e9 0%,#0284c7 100%)',
            border: 'none', borderRadius: '10px',
            fontSize: '14px', fontWeight: '600', color: '#fff',
            cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
            opacity: loading || !email || !password ? 0.5 : 1,
            marginBottom: '20px',
            transition: 'opacity 0.15s, transform 0.12s',
            boxShadow: '0 4px 16px rgba(14,165,233,0.30)',
          }}
          onMouseEnter={e => { if (!loading && email && password) e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
        >
          {loading ? '...' : isSignUp ? t.signup : t.signin}
        </button>

        {/* Toggle */}
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', margin: 0 }}>
          {isSignUp ? t.hasAcc : t.noAcc}{' '}
          <span
            onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccess(null) }}
            style={{ color: '#0ea5e9', fontWeight: '600', cursor: 'pointer' }}
          >
            {isSignUp ? t.signinLink : t.signupLink}
          </span>
        </p>

        {/* Bottom tagline */}
        <p style={{ position: 'absolute', bottom: '28px', left: 0, right: 0, textAlign: 'center', fontSize: '11px', color: '#d1d5db', letterSpacing: '0.3px' }}>
          {t.tagline}
        </p>
      </div>

      {/* ════════════════════════════════
          RIGHT — animated canvas
      ════════════════════════════════ */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        background: '#f1f5f9',
        backgroundImage: 'radial-gradient(circle, #c8d3e0 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        animation: 'lp-grid-pulse 4s ease-in-out infinite',
      }}>

        {/* Iridescent gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: [
            'radial-gradient(ellipse at 20% 20%, rgba(199,210,254,0.35) 0%, transparent 50%)',
            'radial-gradient(ellipse at 80% 75%, rgba(167,243,208,0.30) 0%, transparent 50%)',
            'radial-gradient(ellipse at 65% 10%, rgba(251,207,232,0.28) 0%, transparent 40%)',
          ].join(', '),
        }} />

        {/* ── WIDGET: Map (large, background, top-left) ── */}
        <div style={{
          position: 'absolute', left: '4%', top: '7%', width: '52%', height: '43%',
          background: 'rgba(255,255,255,0.84)', backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.92)', borderRadius: '14px',
          boxShadow: '0 4px 18px rgba(0,0,0,0.07)', overflow: 'hidden', zIndex: 2,
          animation: 'lp-float-a 7s ease-in-out infinite',
        } as React.CSSProperties}>
          <div style={{ padding: '9px 13px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(248,250,252,0.85)', flexShrink: 0 }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#0ea5e9" strokeWidth="1.6"><circle cx="6" cy="5" r="2.2"/><path d="M6 1C4 1 2 2.7 2 5c0 2.4 4 6 4 6s4-3.6 4-6c0-2.3-2-4-4-4z"/></svg>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#374151' }}>Map</span>
            <span style={{ marginLeft: 'auto', fontSize: '10px', color: '#9ca3af', background: 'rgba(0,0,0,0.04)', borderRadius: '8px', padding: '1px 6px' }}>Live</span>
          </div>
          <svg width="100%" height="calc(100% - 34px)" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
            <rect width="320" height="180" fill="#d8ecd4"/>
            <ellipse cx="240" cy="55"  rx="65" ry="38" fill="#a8c8d8" opacity="0.75"/>
            <ellipse cx="85"  cy="100" rx="58" ry="36" fill="#b8d4a0" opacity="0.80"/>
            <ellipse cx="185" cy="130" rx="70" ry="28" fill="#c4d9a8" opacity="0.70"/>
            <path d="M0 90 Q90 75 160 95 Q230 115 320 85" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
            <path d="M130 0 Q136 90 132 180" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M0 140 Q60 135 110 145 Q160 155 200 140" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6"/>
            {/* Pins */}
            <g transform="translate(148,90)"><circle r="8" fill="#0ea5e9" opacity="0.25"/><circle r="5.5" fill="#0ea5e9"/><circle cx="0" cy="-0.5" r="2.5" fill="white"/></g>
            <g transform="translate(78,88)"> <circle r="6" fill="#22c55e" opacity="0.25"/><circle r="4.5" fill="#22c55e"/><circle cx="0" cy="-0.5" r="2" fill="white"/></g>
            <g transform="translate(218,50)"><circle r="6" fill="#f59e0b" opacity="0.25"/><circle r="4.5" fill="#f59e0b"/><circle cx="0" cy="-0.5" r="2" fill="white"/></g>
          </svg>
        </div>

        {/* ── WIDGET: Bar Chart (top-right) — DRAG TARGET 1 ── */}
        <div style={{
          position: 'absolute', left: '59%', top: '7%', width: '37%', height: '40%',
          background: 'rgba(255,255,255,0.84)', backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.92)', borderRadius: '14px',
          overflow: 'hidden', zIndex: 3,
          animation: 'lp-bar-drag 22s ease-in-out infinite',
          transition: 'box-shadow 0.3s',
        } as React.CSSProperties}>
          <div style={{ padding: '9px 13px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(248,250,252,0.85)' }}>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#22c55e" strokeWidth="1.6"><rect x="1" y="6" width="2" height="5"/><rect x="5" y="3" width="2" height="8"/><rect x="9" y="1" width="2" height="10"/></svg>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#374151' }}>Analytics</span>
          </div>
          <div style={{ padding: '10px 14px 14px', height: 'calc(100% - 34px)', display: 'flex', alignItems: 'flex-end', gap: '5px' }}>
            {[48, 72, 55, 90, 62, 84, 45, 76].map((h, i) => (
              <div key={i} style={{
                flex: 1, height: `${h}%`, borderRadius: '4px 4px 0 0',
                background: ['#93c5fd','#6ee7b7','#fcd34d','#93c5fd','#6ee7b7','#a5b4fc','#93c5fd','#6ee7b7'][i],
                opacity: 0.85,
                animation: `lp-bar-shimmer ${2.5 + i * 0.3}s ease-in-out infinite ${i * 0.15}s`,
              }}/>
            ))}
          </div>
        </div>

        {/* ── WIDGET: KPI 1 (middle-left) — DRAG TARGET 2 ── */}
        <div style={{
          position: 'absolute', left: '4%', top: '54%', width: '27%', height: '23%',
          background: 'rgba(255,255,255,0.84)', backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.92)', borderRadius: '14px',
          overflow: 'hidden', zIndex: 3,
          animation: 'lp-kpi-drag 22s ease-in-out infinite',
        } as React.CSSProperties}>
          <div style={{ padding: '16px 18px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '5px' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Total Users</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#111827', lineHeight: 1 }}>2,847</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round"><path d="M2 9 L6 4 L10 6"/></svg>
              <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '700' }}>+12.3%</span>
              <span style={{ fontSize: '10px', color: '#9ca3af' }}>vs last month</span>
            </div>
          </div>
        </div>

        {/* ── WIDGET: KPI 2 (middle-center) — static floating ── */}
        <div style={{
          position: 'absolute', left: '34%', top: '54%', width: '22%', height: '23%',
          background: 'rgba(255,255,255,0.84)', backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.92)', borderRadius: '14px',
          overflow: 'hidden', zIndex: 2,
          animation: 'lp-float-b 8s ease-in-out infinite 1.2s',
        } as React.CSSProperties}>
          <div style={{ padding: '16px 18px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '5px' }}>
            <div style={{ fontSize: '10px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.6px' }}>Map Layers</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#111827', lineHeight: 1 }}>48</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round"><path d="M2 4 L6 8 L10 4"/></svg>
              <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '700' }}>−3.1%</span>
            </div>
          </div>
        </div>

        {/* ── WIDGET: Table (right-middle) — static floating ── */}
        <div style={{
          position: 'absolute', left: '59%', top: '51%', width: '37%', height: '26%',
          background: 'rgba(255,255,255,0.84)', backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.92)', borderRadius: '14px',
          overflow: 'hidden', zIndex: 2,
          animation: 'lp-float-c 6s ease-in-out infinite 0.6s',
        } as React.CSSProperties}>
          <div style={{ padding: '9px 13px', borderBottom: '1px solid rgba(0,0,0,0.06)', background: 'rgba(248,250,252,0.85)' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#374151' }}>Data Table</span>
          </div>
          {[['Cairo', '1.24M', '#22c55e', '+'], ['Giza', '980K', '#0ea5e9', '+'], ['Alex', '840K', '#ef4444', '−']].map(([city, val, color, dir], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '7px 13px', borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.04)' : 'none', gap: '8px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color, flexShrink: 0 }}/>
              <span style={{ flex: 1, fontSize: '11px', color: '#374151', fontWeight: '500' }}>{city}</span>
              <span style={{ fontSize: '11px', color: '#6b7280' }}>{val}</span>
              <span style={{ fontSize: '11px', color, fontWeight: '700', width: '14px', textAlign: 'center' }}>{dir}</span>
            </div>
          ))}
        </div>

        {/* ── WIDGET: Line Chart (bottom strip) ── */}
        <div style={{
          position: 'absolute', left: '4%', top: '80%', width: '91%', height: '16%',
          background: 'rgba(255,255,255,0.84)', backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.92)', borderRadius: '14px',
          overflow: 'hidden', zIndex: 2,
          animation: 'lp-float-a 9s ease-in-out infinite 2s',
        } as React.CSSProperties}>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', padding: '0 16px', gap: '14px' }}>
            <span style={{ fontSize: '11px', fontWeight: '600', color: '#374151', whiteSpace: 'nowrap', flexShrink: 0 }}>Activity Trend</span>
            <svg style={{ flex: 1 }} height="38" viewBox="0 0 400 38" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lg-login" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.18"/>
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0 30 Q40 22 80 26 Q120 30 160 18 Q200 8 240 14 Q280 20 320 10 Q360 2 400 8 L400 38 L0 38 Z" fill="url(#lg-login)"/>
              <path d="M0 30 Q40 22 80 26 Q120 30 160 18 Q200 8 240 14 Q280 20 320 10 Q360 2 400 8" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round"/>
              {[80,160,240,320].map((x,i) => (
                <circle key={i} cx={x} cy={[26,18,14,10][i]} r="3" fill="#0ea5e9"/>
              ))}
            </svg>
          </div>
        </div>

        {/* ── ANIMATED CURSOR ── */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          pointerEvents: 'none', zIndex: 20,
          animation: 'lp-cursor 22s ease-in-out infinite',
        } as React.CSSProperties}>
          <div style={{ animation: 'lp-click 22s ease-in-out infinite', transformOrigin: '4px 2px' }}>
            <svg width="26" height="34" viewBox="0 0 26 34" fill="none">
              <path
                d="M4 2L4 26L8.5 21L13 31.5L16.5 30L12 20L20.5 20Z"
                fill="white" stroke="#1e293b" strokeWidth="1.8" strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* ── bottom tagline ── */}
        <div style={{
          position: 'absolute', bottom: '14px', left: 0, right: 0,
          textAlign: 'center', pointerEvents: 'none', zIndex: 5,
        }}>
          <p style={{ fontSize: '11px', fontWeight: '500', color: '#94a3b8', letterSpacing: '2.5px', textTransform: 'uppercase', margin: 0 }}>
            Build · Visualize · Share
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
