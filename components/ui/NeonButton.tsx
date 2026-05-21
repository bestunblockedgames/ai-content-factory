'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface NeonButtonProps {
  children: ReactNode
  onClick?: () => void
  color?: 'cyan' | 'magenta' | 'blue'
  disabled?: boolean
  className?: string
}

const colorMap = {
  cyan: 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10',
  magenta: 'border-neon-magenta text-neon-magenta hover:bg-neon-magenta/10',
  blue: 'border-neon-blue text-neon-blue hover:bg-neon-blue/10',
}

export function NeonButton({
  children,
  onClick,
  color = 'cyan',
  disabled = false,
  className = '',
}: NeonButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`border rounded-lg px-4 py-2 font-medium transition-all duration-200 ${colorMap[color]} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      whileHover={disabled ? undefined : { scale: 1.05 }}
      whileTap={disabled ? undefined : { scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}
