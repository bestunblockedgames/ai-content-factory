'use client'

import { useState, KeyboardEvent } from 'react'
import { NeonButton } from '@/components/ui/NeonButton'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState('')

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value.trim())
      setValue('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex gap-2 p-3 border-t border-dark-border">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="输入主题或指令..."
        className="flex-1 bg-dark-card border border-dark-border rounded-lg px-4 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-neon-cyan/50 transition-colors"
      />
      <NeonButton onClick={handleSend} disabled={disabled || !value.trim()}>
        发送
      </NeonButton>
    </div>
  )
}
