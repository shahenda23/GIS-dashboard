import { TableConfig } from '../../types/builder.types'
 
interface TableWidgetProps {
  config?: Partial<TableConfig>
}
 
const SAMPLE_DATA = [
  { id: '#401', time: '10:24 AM', type: 'Zone A', location: 'Sector 4-B', status: 'Active' },
  { id: '#402', time: '10:31 AM', type: 'Zone B', location: 'Main Blvd',  status: 'Pending' },
  { id: '#403', time: '10:45 AM', type: 'Zone C', location: 'Hub 9',      status: 'Active' },
  { id: '#404', time: '11:02 AM', type: 'Zone A', location: 'Central',    status: 'Delayed' },
  { id: '#405', time: '11:15 AM', type: 'Zone D', location: 'East Ring',  status: 'Active' },
]
 
const STATUS_COLORS: Record<string, string> = {
  Active:  '#22c55e',
  Pending: '#f59e0b',
  Delayed: '#ef4444',
}
 
const ROW_HEIGHTS: Record<string, number> = {
  compact:     28,
  normal:      36,
  comfortable: 48,
}
 
export function TableWidget({ config = {} }: TableWidgetProps) {
  const maxRows    = config.maxRows       ?? 10
  const rowHeight  = config.rowHeight     ?? 'normal'
  const fontSize   = config.fontSize      ?? 12
  const showNums   = config.showRowNumbers ?? false
  const stripe     = config.stripeRows    !== false
  const height     = ROW_HEIGHTS[rowHeight] ?? 36
 
  const displayData = SAMPLE_DATA.slice(0, maxRows)
 
  const columns = [
    ...(showNums ? ['#'] : []),
    'ID', 'Time', 'Type', 'Location', 'Status',
  ]
 
  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      {config.allowSearch && (
        <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)' }}>
          <input
            placeholder="Search..."
            style={{
              width: '100%',
              padding: '5px 10px',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '12px',
              color: 'var(--text-primary)',
              background: 'var(--page-bg)',
              outline: 'none',
            }}
          />
        </div>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: `${fontSize}px` }}>
        <thead>
          <tr style={{ background: 'var(--page-bg)' }}>
            {columns.map(col => (
              <th
                key={col}
                style={{
                  padding: `6px 12px`,
                  textAlign: 'left',
                  fontWeight: '600',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  fontSize: '10px',
                  borderBottom: '1px solid var(--border)',
                  whiteSpace: 'nowrap',
                  cursor: config.allowSorting ? 'pointer' : 'default',
                }}
              >
                {col} {config.allowSorting && col !== '#' ? '↕' : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayData.map((row, i) => (
            <tr
              key={row.id}
              style={{
                background: stripe && i % 2 !== 0 ? 'var(--page-bg)' : 'transparent',
                height: `${height}px`,
              }}
            >
              {showNums && (
                <td style={{ padding: '0 12px', color: 'var(--text-muted)', fontSize: '11px' }}>
                  {i + 1}
                </td>
              )}
              <td style={{ padding: '0 12px', color: 'var(--text-primary)', fontWeight: '600' }}>
                {row.id}
              </td>
              <td style={{ padding: '0 12px', color: 'var(--text-secondary)' }}>{row.time}</td>
              <td style={{ padding: '0 12px', color: 'var(--text-secondary)' }}>{row.type}</td>
              <td style={{ padding: '0 12px', color: 'var(--text-secondary)' }}>{row.location}</td>
              <td style={{ padding: '0 12px' }}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '600',
                  background: `${STATUS_COLORS[row.status]}20`,
                  color: STATUS_COLORS[row.status],
                }}>
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
 
export default TableWidget