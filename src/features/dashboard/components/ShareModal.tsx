import { useState } from "react"
import { useTheme } from '../../../context/ThemeContext'

interface ShareModalProps {
  dashboardId: string
  onClose: () => void
}
 
function ShareModal({ dashboardId, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${window.location.origin}/dashboard/${dashboardId}`
  const { lang } = useTheme()

    const t = {
    en: {
      title: 'Share Dashboard',
      sub: 'Anyone with this link can view this dashboard.',
      copy: 'Copy Link',
      copied: 'Copied!',
      close: 'Close',
    },
    ar: {
      title: 'مشاركة اللوحة',
      sub: 'أي شخص لديه هذا الرابط يمكنه عرض اللوحة.',
      copy: 'نسخ الرابط',
      copied: 'تم النسخ!',
      close: 'إغلاق',
    },
  }[lang]
 
  function handleCopy() {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
 
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          width: '420px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
        }}
      >
        <h2
          style={{
            margin: '0 0 8px 0',
            fontFamily: 'Georgia, serif',
            color: '#1a1a1a',
            fontSize: '20px',
          }}
        >
          {t.title}
        </h2>
        <p
          style={{
            margin: '0 0 20px 0',
            color: '#888',
            fontSize: '13px',
            fontFamily: 'sans-serif',
          }}
        >
          {t.sub}
        </p>
 
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
          }}
        >
          <input
            readOnly
            value={shareUrl}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '13px',
              fontFamily: 'monospace',
              backgroundColor: '#f9f9f9',
              color: '#555',
              outline: 'none',
            }}
          />
          <button
            onClick={handleCopy}
            style={{
              padding: '10px 18px',
              backgroundColor: copied ? '#245274' : '#0ea5e9',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '13px',
              fontFamily: 'sans-serif',
              transition: 'background-color 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {copied ? `✓ ${t.copied}` : t.copy}
          </button>
        </div>
 
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'transparent',
            border: '1px solid #ddd',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '13px',
            color: '#888',
            fontFamily: 'sans-serif',
          }}
        >
          {t.close}
        </button>
      </div>
    </div>
  )
}

export default ShareModal;