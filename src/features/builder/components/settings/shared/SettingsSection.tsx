import { ReactNode } from 'react'

interface SettingsSectionProps {
  title: string
  children: ReactNode
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <p style={{
        fontSize: '10px',
        fontWeight: '700',
        color: 'var(--text-muted)',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        marginBottom: '10px',
        paddingBottom: '6px',
        borderBottom: '1px solid var(--border)',
      }}>
        {title}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {children}
      </div>
    </div>
  )
}

export default SettingsSection