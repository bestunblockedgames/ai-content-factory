'use client'

import { Stage, STAGES } from '@/types'
import { StageNode } from './StageNode'

interface PipelineBarProps {
  currentStage: Stage
  completedStages: Stage[]
  onStageClick?: (stage: Stage) => void
}

export function PipelineBar({ currentStage, completedStages, onStageClick }: PipelineBarProps) {
  const currentIdx = STAGES.indexOf(currentStage)

  return (
    <div className="flex items-center justify-center gap-2 py-4 px-6">
      {STAGES.map((stage, idx) => {
        const isCompleted = completedStages.includes(stage)
        const isActive = stage === currentStage
        const status = isCompleted ? 'completed' : isActive ? 'active' : 'pending'

        return (
          <div key={stage} className="flex items-center">
            <StageNode stage={stage} status={status} onClick={() => onStageClick?.(stage)} />
            {idx < STAGES.length - 1 && (
              <div className="w-8 h-0.5 mx-1">
                <div className={`h-full rounded ${idx < currentIdx ? 'data-flow-line' : 'bg-dark-border'}`} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
