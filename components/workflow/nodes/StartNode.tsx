import { Handle, Position, NodeProps } from '@xyflow/react'
import { nodeBaseStyle, nodeSelectedStyle, handleStyle } from './NodeStyles'

export function StartNode({ data, selected }: NodeProps) {
  return (
    <div
      style={{
        ...nodeBaseStyle,
        ...(selected ? nodeSelectedStyle : {}),
        background: 'linear-gradient(135deg, #1a2e1a, #1a1f2e)',
        borderColor: selected ? '#00f5d4' : '#2a5040',
        textAlign: 'center',
        padding: '20px 28px',
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '4px' }}>&#9654;</div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#00f5d4' }}>
        {(data as { label?: string }).label || '开始'}
      </div>
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </div>
  )
}
