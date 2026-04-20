import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, GitBranch, Workflow } from 'lucide-react';
import { useNodes, useEdges } from '@store/index';
import { useWorkflowValidator } from '@features/validator/hooks/useWorkflowValidator';
import { cn } from '@lib/cn';

export const WorkflowStatsBar: React.FC = () => {
  const nodes    = useNodes();
  const edges    = useEdges();
  const { validate } = useWorkflowValidator();

  if (nodes.length === 0) return null;

  const result   = validate();
  const errCount = result.errors.length;
  const wrnCount = result.warnings.length;

  const nodeCounts = nodes.reduce<Record<string, number>>((acc, n) => {
    acc[n.type ?? 'unknown'] = (acc[n.type ?? 'unknown'] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className={cn(
      'absolute bottom-4 left-1/2 z-10 -translate-x-1/2',
      'flex items-center gap-3 rounded-full border bg-white px-4 py-1.5 shadow-panel',
      errCount > 0 ? 'border-red-200' : wrnCount > 0 ? 'border-amber-200' : 'border-gray-200'
    )}>
      {/* Node count */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <Workflow className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-semibold text-gray-700">{nodes.length}</span>
        <span>{nodes.length === 1 ? 'node' : 'nodes'}</span>
      </div>

      <div className="h-3.5 w-px bg-gray-200" />

      {/* Edge count */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500">
        <GitBranch className="h-3.5 w-3.5 text-gray-400" />
        <span className="font-semibold text-gray-700">{edges.length}</span>
        <span>{edges.length === 1 ? 'edge' : 'edges'}</span>
      </div>

      <div className="h-3.5 w-px bg-gray-200" />

      {/* Validation status */}
      {errCount === 0 && wrnCount === 0 ? (
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Valid
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {errCount > 0 && (
            <div className="flex items-center gap-1 text-xs font-semibold text-red-600">
              <AlertCircle className="h-3.5 w-3.5" />
              {errCount} error{errCount > 1 ? 's' : ''}
            </div>
          )}
          {wrnCount > 0 && (
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
              <AlertTriangle className="h-3.5 w-3.5" />
              {wrnCount} warning{wrnCount > 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {/* Node type breakdown */}
      {Object.keys(nodeCounts).length > 1 && (
        <>
          <div className="h-3.5 w-px bg-gray-200" />
          <div className="flex items-center gap-1.5">
            {Object.entries(nodeCounts).map(([type, count]) => {
              const colors: Record<string, string> = {
                start:     'bg-emerald-400',
                task:      'bg-blue-400',
                approval:  'bg-amber-400',
                automated: 'bg-violet-400',
                end:       'bg-red-400',
              };
              return (
                <div key={type} className="flex items-center gap-0.5" title={`${count} ${type} node(s)`}>
                  <div className={cn('h-2 w-2 rounded-full', colors[type] ?? 'bg-gray-400')} />
                  <span className="text-[10px] font-semibold text-gray-500">{count}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
