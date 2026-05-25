import { Handle, Position, NodeProps } from '@xyflow/react'
import { nodeBaseStyle, nodeSelectedStyle, handleStyle } from './NodeStyles'

export function EndNode({ data, selected }: NodeProps) {
  return (
    <div
      style={{
        ...nodeBaseStyle,
        ...(selected ? nodeSelectedStyle : {}),
        background: 'linear-gradient(135deg, #2e1a1a, #1a1f2e)',
        borderColor: selected ? '#00f5d4' : '#50402a',
        textAlign: 'center',
        padding: '20px 28px',
      }}
    >
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <div style={{ fontSize: '24px', marginBottom: '4px' }}>&#9724;</div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#f72585' }}>
        {(data as { label?: string }).label || '结束'}
      </div>
    </div>
  )
}
