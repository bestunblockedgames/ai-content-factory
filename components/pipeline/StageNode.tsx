'use client'

import { motion } from 'framer-motion'
import { Stage, STAGE_LABELS } from '@/types'

interface StageNodeProps {
  stage: Stage
  status: 'pending' | 'active' | 'completed'
  onClick?: () => void
}

const statusStyles = {
  pending: 'bg-dark-border text-gray-500',
  active: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan',
  completed: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/50',
}

export function StageNode({ stage, status, onClick }: StageNodeProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg border transition-all ${statusStyles[status]}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {status === 'active' && (
        <motion.div
          className="absolute inset-0 rounded-lg border border-neon-cyan"
          animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${status === 'active' ? 'animate-glow-ring' : ''}`}>
        {status === 'completed' ? '✓' : STAGE_LABELS[stage].charAt(0)}
      </div>
      <span className="text-xs whitespace-nowrap">{STAGE_LABELS[stage]}</span>
    </motion.button>
  )
}
