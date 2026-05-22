import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 内容工厂',
  description: '可视化 AI 内容创作平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-dark-bg min-h-screen">{children}</body>
    </html>
  )
}
