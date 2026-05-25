import { Handle, Position, NodeProps } from '@xyflow/react'
import { nodeBaseStyle, nodeSelectedStyle, nodeHeaderStyle, nodeBodyStyle, handleStyle } from './NodeStyles'
import { LLMNodeData } from '@/types/workflow'

export function LLMNode({ data, selected }: NodeProps) {
  const d = data as unknown as LLMNodeData
  return (
    <div
      style={{
        ...nodeBaseStyle,
        ...(selected ? nodeSelectedStyle : {}),
      }}
    >
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <div style={nodeHeaderStyle}>
        <span style={{ color: '#4361ee', fontSize: '16px' }}>&#9881;</span>
        <span>{d.label || 'LLM'}</span>
      </div>
      <div style={nodeBodyStyle}>
        <div>模型: {d.model || 'sonnet'}</div>
        <div>温度: {d.temperature ?? 0.7}</div>
      </div>
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </div>
  )
}
