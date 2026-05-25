import { StartNode } from './StartNode'
import { EndNode } from './EndNode'
import { LLMNode } from './LLMNode'
import { ToolNode } from './ToolNode'

export const nodeTypes = {
  start: StartNode,
  end: EndNode,
  llm: LLMNode,
  tool: ToolNode,
}
