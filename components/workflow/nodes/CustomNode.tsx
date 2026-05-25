import { Handle, Position, NodeProps } from '@xyflow/react'
import { nodeBaseStyle, nodeSelectedStyle, nodeHeaderStyle, nodeBodyStyle, handleStyle } from './NodeStyles'

export interface CustomNodeData extends Record<string, unknown> {
  label: string
  description: string
  params: Record<string, string>
}

export function CustomNode({ data, selected }: NodeProps) {
  const d = data as unknown as CustomNodeData
  const paramKeys = Object.keys(d.params || {})

  return (
    <div
      style={{
        ...nodeBaseStyle,
        border: '1px solid #7c3aed',
        ...(selected ? { ...nodeSelectedStyle, borderColor: '#a78bfa', boxShadow: '0 0 12px rgba(124,58,237,0.4)' } : {}),
      }}
    >
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <div style={{ ...nodeHeaderStyle, background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(167,139,250,0.1))' }}>
        <span style={{ color: '#a78bfa', fontSize: '16px' }}>&#10022;</span>
        <span>{d.label || '自定义节点'}</span>
      </div>
      <div style={nodeBodyStyle}>
        {d.description && (
          <div style={{ color: '#9ca3af', fontSize: '11px', marginBottom: '4px' }}>{d.description}</div>
        )}
        {paramKeys.length > 0 ? (
          paramKeys.map((key) => (
            <div key={key} style={{ fontSize: '11px', color: '#6b7280' }}>
              {key}: <span style={{ color: '#d1d5db' }}>{d.params[key]}</span>
            </div>
          ))
        ) : (
          <div style={{ color: '#6b7280', fontSize: '11px', fontStyle: 'italic' }}>点击右侧配置</div>
        )}
      </div>
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </div>
  )
}
