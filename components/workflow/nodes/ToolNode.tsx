import { Handle, Position, NodeProps } from '@xyflow/react'
import { nodeBaseStyle, nodeSelectedStyle, nodeHeaderStyle, nodeBodyStyle, handleStyle } from './NodeStyles'
import { ToolNodeData } from '@/types/workflow'

const toolIcons: Record<string, string> = {
  search: '🔍',
  http: '🌐',
  code: '💻',
  knowledge: '📚',
  sql: '📊',
  python: '🐍',
}

export function ToolNode({ data, selected }: NodeProps) {
  const d = data as unknown as ToolNodeData
  const icon = toolIcons[d.toolType || 'search'] || '🔧'
  return (
    <div
      style={{
        ...nodeBaseStyle,
        ...(selected ? nodeSelectedStyle : {}),
      }}
    >
      <Handle type="target" position={Position.Left} style={handleStyle} />
      <div style={nodeHeaderStyle}>
        <span style={{ fontSize: '16px' }}>{icon}</span>
        <span>{d.label || '工具'}</span>
      </div>
      <div style={nodeBodyStyle}>
        <div>类型: {d.toolType || 'search'}</div>
        {d.endpoint && <div>端点: {d.endpoint}</div>}
      </div>
      <Handle type="source" position={Position.Right} style={handleStyle} />
    </div>
  )
}
