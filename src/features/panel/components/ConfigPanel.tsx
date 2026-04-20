import React from 'react';
import { Settings } from 'lucide-react';
import { useSelectedNode } from '@store/index';
import { PanelHeader } from './PanelHeader';
import { StartNodeForm } from '../forms/StartNodeForm';
import { TaskNodeForm } from '../forms/TaskNodeForm';
import { ApprovalNodeForm } from '../forms/ApprovalNodeForm';
import { AutomatedNodeForm } from '../forms/AutomatedNodeForm';
import { EndNodeForm } from '../forms/EndNodeForm';
import { NODE_TYPES } from '@types-app/nodes';
import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
} from '@types-app/nodes';

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
export const ConfigPanel: React.FC = () => {
  const node = useSelectedNode();

  return (
    <aside className="flex h-full w-72 flex-col border-l border-gray-200 bg-white">
      {!node ? (
        <EmptyPanel />
      ) : (
        <>
          <PanelHeader nodeType={node.data.nodeType} nodeId={node.id} />

          {/* Scrollable form body */}
          <div className="flex-1 overflow-y-auto panel-scroll">
            {/* Node ID (read-only, for debugging/reference) */}
            <div className="mx-4 mt-4 mb-4 rounded-lg bg-gray-50 px-3 py-1.5">
              <p className="font-mono text-[10px] text-gray-400 truncate">
                ID: {node.id}
              </p>
            </div>

            {/* Discriminated union — TypeScript narrows here */}
            {node.data.nodeType === NODE_TYPES.START && (
              <StartNodeForm
                key={node.id}
                nodeId={node.id}
                data={node.data as StartNodeData}
              />
            )}

            {node.data.nodeType === NODE_TYPES.TASK && (
              <TaskNodeForm
                key={node.id}
                nodeId={node.id}
                data={node.data as TaskNodeData}
              />
            )}

            {node.data.nodeType === NODE_TYPES.APPROVAL && (
              <ApprovalNodeForm
                key={node.id}
                nodeId={node.id}
                data={node.data as ApprovalNodeData}
              />
            )}

            {node.data.nodeType === NODE_TYPES.AUTOMATED && (
              <AutomatedNodeForm
                key={node.id}
                nodeId={node.id}
                data={node.data as AutomatedNodeData}
              />
            )}

            {node.data.nodeType === NODE_TYPES.END && (
              <EndNodeForm
                key={node.id}
                nodeId={node.id}
                data={node.data as EndNodeData}
              />
            )}
          </div>
        </>
      )}
    </aside>
  );
};
