'use client'

import { motion } from 'framer-motion'
import { ChatMessage } from '@/types'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
          isUser
            ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/30'
            : 'bg-dark-card text-gray-300 border border-dark-border'
        }`}
      >
        {message.content}
      </div>
    </motion.div>
  )
}
