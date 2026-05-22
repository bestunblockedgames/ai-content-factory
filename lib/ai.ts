import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function streamChat(
  messages: { role: 'user' | 'assistant'; content: string }[],
  systemPrompt: string
): Promise<AsyncGenerator<string>> {
  const stream = client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages,
  })

  return (async function* () {
    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        yield event.delta.text
      }
    }
  })()
}

export async function generateContent(
  prompt: string,
  systemPrompt: string
): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  })

  const textBlock = response.content.find((b) => b.type === 'text')
  return textBlock ? textBlock.text : ''
}
