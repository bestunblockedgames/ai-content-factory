'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className = '', hover = false }: GlassCardProps) {
  return (
    <motion.div
      className={`glass rounded-xl p-4 ${className}`}
      whileHover={hover ? { scale: 1.02, borderColor: 'rgba(0, 245, 212, 0.3)' } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}
