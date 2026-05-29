interface Tab {
  id: string
  label: string
}

interface SettingsTabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
}

function SettingsTabs({ tabs, activeTab, onChange }: SettingsTabsProps) {
  return (
    <div style={{
      display: 'flex',
      borderBottom: '1px solid var(--border)',
      marginBottom: '16px',
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1,
            padding: '8px 4px',
            background: 'transparent',
            border: 'none',
            borderBottom: `2px solid ${activeTab === tab.id ? 'var(--accent)' : 'transparent'}`,
            color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-muted)',
            fontSize: '12px',
            fontWeight: activeTab === tab.id ? '600' : '400',
            cursor: 'pointer',
            transition: 'all 0.15s',
            marginBottom: '-1px',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default SettingsTabs