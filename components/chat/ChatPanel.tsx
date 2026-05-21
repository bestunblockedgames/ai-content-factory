'use client'

import { useRef, useEffect } from 'react'
import { ChatMessage } from '@/types'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'
import { GlassCard } from '@/components/ui/GlassCard'

interface ChatPanelProps {
  messages: ChatMessage[]
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatPanel({ messages, onSend, disabled = false }: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <GlassCard className="flex flex-col h-full">
      <div className="border-b border-dark-border px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-400">对话</h2>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-600 text-sm mt-8">
            输入一个主题，开始创作
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>
      <ChatInput onSend={onSend} disabled={disabled} />
    </GlassCard>
  )
}
