import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useTheme } from '../context/ThemeContext'
import logoUrl from '../assets/logo.svg'

function LoginPage() {
  const { lang } = useTheme()
  const navigate  = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [success, setSuccess]   = useState<string | null>(null)

  const t = {
    en: {
      title:   'Welcome back',
      titleUp: 'Create your account',
      sub:     'Sign in to manage your GIS dashboards',
      subUp:   'Start building interactive GIS dashboards',
      email:   'Email address',
      pass:    'Password',
      signin:  'Sign In',
      signup:  'Create Account',
      noAcc:   "Don't have an account?",
      hasAcc:  'Already have an account?',
      signupLink: 'Sign up',
      signinLink: 'Sign in',
      checkEmail: 'Check your email to confirm your account!',
    },
    ar: {
      title:   'مرحباً بعودتك',
      titleUp: 'إنشاء حساب جديد',
      sub:     'سجّل دخولك لإدارة لوحات GIS',
      subUp:   'ابدأ في بناء لوحات GIS تفاعلية',
      email:   'البريد الإلكتروني',
      pass:    'كلمة المرور',
      signin:  'تسجيل الدخول',
      signup:  'إنشاء حساب',
      noAcc:   'ليس لديك حساب؟',
      hasAcc:  'لديك حساب بالفعل؟',
      signupLink: 'سجّل الآن',
      signinLink: 'سجّل دخولك',
      checkEmail: 'تحقق من بريدك الإلكتروني لتأكيد حسابك!',
    },
  }[lang]

  async function handleSubmit() {
    if (!email || !password) return
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setSuccess(t.checkEmail)
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        navigate('/')
      }
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--page-bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>

        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '32px',
        }}>
          <img src={logoUrl} alt="logo" style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-md)' }} />
          <span style={{
            fontSize: '15px',
            fontWeight: '600',
            color: 'var(--text-primary)',
          }}>
            GIS Dashboard Builder
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '22px',
          fontWeight: '700',
          color: 'var(--text-primary)',
          marginBottom: '6px',
          letterSpacing: '-0.3px',
        }}>
          {isSignUp ? t.titleUp : t.title}
        </h1>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          marginBottom: '28px',
          lineHeight: '1.5',
        }}>
          {isSignUp ? t.subUp : t.sub}
        </p>

        {/* Email */}
        <div style={{ marginBottom: '12px' }}>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            marginBottom: '5px',
          }}>
            {t.email}
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              color: 'var(--text-primary)',
              background: 'var(--page-bg)',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '12px',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            marginBottom: '5px',
          }}>
            {t.pass}
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '13px',
              color: 'var(--text-primary)',
              background: 'var(--page-bg)',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            fontSize: '12px',
            color: '#ef4444',
            marginBottom: '14px',
          }}>
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #86efac',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            fontSize: '12px',
            color: '#16a34a',
            marginBottom: '14px',
          }}>
            {success}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          style={{
            width: '100%',
            padding: '11px',
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            fontWeight: '500',
            color: '#fff',
            cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
            opacity: loading || !email || !password ? 0.6 : 1,
            marginBottom: '16px',
            transition: 'opacity 0.15s',
          }}
        >
          {loading ? '...' : isSignUp ? t.signup : t.signin}
        </button>

        {/* Toggle */}
        <p style={{
          textAlign: 'center',
          fontSize: '13px',
          color: 'var(--text-secondary)',
        }}>
          {isSignUp ? t.hasAcc : t.noAcc}{' '}
          <span
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
              setSuccess(null)
            }}
            style={{
              color: 'var(--accent)',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            {isSignUp ? t.signinLink : t.signupLink}
          </span>
        </p>
      </div>
    </div>
  )
}

export default LoginPage