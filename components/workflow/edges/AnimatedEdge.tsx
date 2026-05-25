import { getBezierPath, EdgeProps } from '@xyflow/react'

export function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <defs>
        <linearGradient id={`edge-gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00f5d4" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#4361ee" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00f5d4" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={`url(#edge-gradient-${id})`}
        strokeWidth={2}
        markerEnd={markerEnd}
        style={{
          ...style,
          filter: 'drop-shadow(0 0 4px rgba(0, 245, 212, 0.4))',
        }}
      />
      <circle r="4" fill="#00f5d4" opacity="0.8">
        <animateMotion dur="2s" repeatCount="indefinite" path={edgePath} />
      </circle>
    </>
  )
}
