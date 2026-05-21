'use client'

import ReactMarkdown from 'react-markdown'

interface MarkdownRendererProps {
  content: string
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert prose-sm max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-semibold text-white mb-3 mt-6">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-medium text-gray-200 mb-2 mt-4">{children}</h3>,
          p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-3">{children}</p>,
          ul: ({ children }) => <ul className="list-disc list-inside text-gray-300 mb-3 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside text-gray-300 mb-3 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-sm">{children}</li>,
          code: ({ children, className }) => {
            const isBlock = className?.includes('language-')
            return isBlock ? (
              <code className="block bg-dark-bg border border-dark-border rounded-lg p-4 text-sm text-neon-cyan overflow-x-auto">{children}</code>
            ) : (
              <code className="bg-dark-border px-1.5 py-0.5 rounded text-neon-cyan text-sm">{children}</code>
            )
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-neon-magenta pl-4 text-gray-400 italic my-4">{children}</blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
