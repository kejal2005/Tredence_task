import React, { useCallback } from 'react';
import { Settings } from 'lucide-react';
import { useSelectedNode, useCanvasActions } from '@store/index';
import { PanelHeader } from './PanelHeader';
import { DynamicForm } from '@components/DynamicForm';
import type { WorkflowNodeData } from '@types-app/nodes';

// ─────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────
const EmptyPanel: React.FC = () => (
  <div className="flex h-full flex-col items-center justify-center gap-3 px-6 py-12 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-300">
      <Settings className="h-6 w-6" />
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-400">No node selected</p>
      <p className="mt-1 text-xs text-gray-300">
        Click any node on the canvas to configure it
      </p>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Main ConfigPanel
// ─────────────────────────────────────────────
/**
 * REFACTORED: Now uses DynamicForm instead of hardcoded if statements.
 *
 * BEFORE: 5+ if statements checking node.type, each importing different form component
 * AFTER: Single DynamicForm component that renders based on schema
 *
 * Benefits:
 * - No hardcoded conditionals
 * - Adding new node type requires ONLY adding schema entry
 * - Scales to any number of node types without code changes
 * - Centralized validation and form logic
 */
export const ConfigPanel: React.FC = () => {
  const node = useSelectedNode();
  const { updateNodeData } = useCanvasActions();

  const handleFormSubmit = useCallback(
    (values: Record<string, unknown>) => {
      if (!node) return;
      updateNodeData(node.id, values);
    },
    [node, updateNodeData]
  );

  if (!node) {
    return (
      <aside className="flex h-full w-72 flex-col border-l border-gray-200 bg-white">
        <EmptyPanel />
      </aside>
    );
  }

  const nodeData = node.data as WorkflowNodeData;

  return (
    <aside className="flex h-full w-72 flex-col border-l border-gray-200 bg-white">
      <PanelHeader nodeType={nodeData.nodeType} nodeId={node.id} />

      {/* Scrollable form body */}
      <div className="flex-1 overflow-y-auto panel-scroll">
        {/* Node ID (read-only, for debugging/reference) */}
        <div className="mx-4 mt-4 mb-4 rounded-lg bg-gray-50 px-3 py-1.5">
          <p className="font-mono text-[10px] text-gray-400 truncate">
            ID: {node.id}
          </p>
        </div>

        {/* Schema-driven form — works for ALL node types */}
        <DynamicForm
          key={node.id}
          nodeType={nodeData.nodeType}
          defaultValues={nodeData}
          onSubmit={handleFormSubmit}
        />
      </div>
    </aside>
  );
};
