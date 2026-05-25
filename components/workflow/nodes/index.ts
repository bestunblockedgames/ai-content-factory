import { StartNode } from './StartNode'
import { EndNode } from './EndNode'
import { LLMNode } from './LLMNode'
import { ToolNode } from './ToolNode'
import { CustomNode } from './CustomNode'

export const nodeTypes = {
  start: StartNode,
  end: EndNode,
  llm: LLMNode,
  tool: ToolNode,
  custom: CustomNode,
}
