import { KPIConfig } from '../../types/builder.types'
 
interface KPIWidgetProps {
  config?: Partial<KPIConfig>
}
 
export function KPIWidget({ config = {} }: KPIWidgetProps) {
  const label     = config.label          ?? 'Total Features'
  const unit      = config.unit           ?? ''
  const fontSize  = config.fontSize       ?? 36
  const showArrow = config.showTrendArrow !== false
 
  const value      = '1,248'
  const change     = 12
  const isPositive = change >= 0
 
  return (
    <div style={{
      padding: '20px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <p style={{
        fontSize: '11px',
        color: 'var(--text-muted)',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        {label}
      </p>
 
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '6px',
          marginBottom: '6px',
        }}>
          <span style={{
            fontSize: `${fontSize}px`,
            fontWeight: '700',
            color: 'var(--text-primary)',
            lineHeight: 1,
          }}>
            {value}
          </span>
          {unit && (
            <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              {unit}
            </span>
          )}
        </div>
 
        {showArrow && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            color: isPositive ? '#22c55e' : '#ef4444',
            fontWeight: '500',
          }}>
            <span>{isPositive ? '↑' : '↓'}</span>
            <span>{Math.abs(change)}%</span>
            <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>
              vs last month
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
 
export default KPIWidget