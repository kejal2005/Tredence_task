import React from 'react';
import { Workflow, GripVertical } from 'lucide-react';
import { DraggableNodeCard } from './DraggableNodeCard';
import { NODE_TYPE_ORDER }   from '@features/nodes/config/nodeConfig';
import { useWorkflowMeta, useSetWorkflowMeta, useNodes, useEdges } from '@store/index';

export const NodePalette: React.FC = () => {
  const meta    = useWorkflowMeta();
  const setMeta = useSetWorkflowMeta();
  const nodes   = useNodes();
  const edges   = useEdges();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-gray-100 px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Workflow className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-sm font-bold text-gray-900">HR Workflow</h1>
          <p className="text-xs text-gray-400">Visual Designer</p>
        </div>
      </div>

      {/* Workflow meta */}
      <div className="border-b border-gray-100 px-4 py-3 space-y-2">
        <input
          value={meta.name}
          onChange={(e) => setMeta({ name: e.target.value })}
          placeholder="Workflow name"
          className="form-input text-sm font-medium"
        />
        <input
          value={meta.description}
          onChange={(e) => setMeta({ description: e.target.value })}
          placeholder="Description (optional)"
          className="form-input text-xs"
        />
      </div>

      {/* Node palette */}
      <div className="flex-1 overflow-y-auto panel-scroll px-4 py-3">
        <div className="mb-2 flex items-center gap-1.5">
          <GripVertical className="h-3.5 w-3.5 text-gray-300" />
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Nodes
          </p>
        </div>

        <div className="space-y-2">
          {NODE_TYPE_ORDER.map((type) => (
            <DraggableNodeCard key={type} nodeType={type} />
          ))}
        </div>
      </div>

      {/* Footer stats */}
      <div className="border-t border-gray-100 px-4 py-3">
        <div className="flex justify-between text-xs text-gray-400">
          <span>{nodes.length} nodes</span>
          <span>{edges.length} connections</span>
        </div>
      </div>
    </aside>
  );
};
