import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Timer } from 'lucide-react';
import { cn } from '@lib/cn';
import { StepStatusIcon, StatusBadge } from './StepStatusIcon';
import { NODE_VISUAL_CONFIG } from '@features/nodes/config/nodeConfig';
import type { SimulationStep } from '@types-app/api';
import type { NodeType } from '@types-app/nodes';

interface ExecutionStepProps {
  step:  SimulationStep;
  index: number;
}

export const ExecutionStep: React.FC<ExecutionStepProps> = ({ step, index }) => {
  const [expanded, setExpanded] = useState(false);

  const config      = NODE_VISUAL_CONFIG[step.nodeType as NodeType];
  const Icon        = config?.icon;
  const hasOutput   = step.output && Object.keys(step.output).length > 0;
  const isRunning   = step.status === 'running';

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-200',
        step.status === 'success' && 'border-emerald-100 bg-emerald-50/30',
        step.status === 'error'   && 'border-red-100 bg-red-50/30',
        step.status === 'skipped' && 'border-gray-100 bg-gray-50/20',
        step.status === 'running' && 'border-blue-200 bg-blue-50/40 shadow-sm',
        step.status === 'pending' && 'border-gray-100 bg-white',
      )}
    >
      {/* Main row */}
      <div className="flex items-start gap-3 p-3">
        {/* Step number */}
        <div className={cn(
          'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full',
          'text-[10px] font-bold',
          isRunning ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
        )}>
          {index + 1}
        </div>

        {/* Node type icon */}
        {Icon && config && (
          <div
            className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md"
            style={{ backgroundColor: config.accentHex + '22' }}
          >
            <Icon className="h-3 w-3" style={{ color: config.accentHex }} />
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-xs font-semibold text-gray-800">
              {step.label || step.nodeType}
            </span>
            <StatusBadge status={step.status} />
          </div>

          <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500">
            {step.message}
          </p>

          {/* Duration */}
          {step.durationMs > 0 && (
            <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-400">
              <Timer className="h-2.5 w-2.5" />
              {step.durationMs}ms
            </div>
          )}
        </div>

        {/* Status icon + expand toggle */}
        <div className="flex flex-shrink-0 items-center gap-1.5">
          <StepStatusIcon status={step.status} />
          {hasOutput && (
            <button
              onClick={() => setExpanded((p) => !p)}
              className="flex h-5 w-5 items-center justify-center rounded text-gray-300 hover:text-gray-500"
            >
              {expanded
                ? <ChevronDown className="h-3.5 w-3.5" />
                : <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Expandable output */}
      {expanded && hasOutput && (
        <div className="border-t border-gray-100 px-3 pb-3 pt-2">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Output
          </p>
          <pre className="overflow-x-auto rounded-lg bg-gray-900 p-2.5 text-[10px] leading-relaxed text-emerald-400 font-mono">
            {JSON.stringify(step.output, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
