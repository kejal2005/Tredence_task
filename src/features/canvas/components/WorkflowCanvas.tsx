import React, { useEffect, useState } from 'react';
import {
  ReactFlow,
  Background,
  MiniMap,
  BackgroundVariant,
  type NodeTypes,
} from '@xyflow/react';

import { useNodes, useEdges, useHistoryActions } from '@store/index';
import { useCanvasHandlers }    from '../hooks/useCanvasHandlers';
import { useDragDrop }          from '../hooks/useDragDrop';
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts';
import { CanvasControls }       from './CanvasControls';
import { EmptyCanvas }          from './EmptyCanvas';
import { WorkflowStatsBar }     from './WorkflowStatsBar';

import { StartNodeComponent }     from '@features/nodes/components/StartNode';
import { TaskNodeComponent }      from '@features/nodes/components/TaskNode';
import { ApprovalNodeComponent }  from '@features/nodes/components/ApprovalNode';
import { AutomatedNodeComponent } from '@features/nodes/components/AutomatedNode';
import { EndNodeComponent }       from '@features/nodes/components/EndNode';

const NODE_TYPES: NodeTypes = {
  start:     StartNodeComponent as NodeTypes[string],
  task:      TaskNodeComponent  as NodeTypes[string],
  approval:  ApprovalNodeComponent  as NodeTypes[string],
  automated: AutomatedNodeComponent as NodeTypes[string],
  end:       EndNodeComponent   as NodeTypes[string],
};

const MINIMAP_NODE_COLORS: Record<string, string> = {
  start:     '#22c55e',
  task:      '#3b82f6',
  approval:  '#f59e0b',
  automated: '#8b5cf6',
  end:       '#ef4444',
};

export const WorkflowCanvas: React.FC = () => {
  const nodes = useNodes();
  const edges = useEdges();
  const { pushSnapshot }    = useHistoryActions();
  const [showMinimap, setShowMinimap] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    onNodesChange, onEdgesChange,
    onConnect, onNodeClick, onPaneClick,
  } = useCanvasHandlers();

  const { reactFlowWrapper, onDragOver, onDrop } = useDragDrop();

  useKeyboardShortcuts();

  // Only push snapshot once on first render
  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      // Don't push initial empty snapshot - causes update loop
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={reactFlowWrapper}
      className="relative h-full w-full"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        fitView={false}
        minZoom={0.2}
        maxZoom={2}
        snapToGrid
        snapGrid={[16, 16]}
        deleteKeyCode={null}
        multiSelectionKeyCode="Shift"
        defaultEdgeOptions={{
          type:      'smoothstep',
          animated:  false,
          style:     { stroke: '#94a3b8', strokeWidth: 2 },
          markerEnd: { type: 'arrowclosed' as const, color: '#94a3b8' },
        }}
        proOptions={{ hideAttribution: true }}
        className="bg-slate-50"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.2}
          color="#cbd5e1"
        />

        {showMinimap && (
          <MiniMap
            nodeColor={(node) => MINIMAP_NODE_COLORS[node.type ?? ''] ?? '#94a3b8'}
            maskColor="rgba(241,245,249,0.7)"
            className="!bottom-16 !right-4 !rounded-xl !border !border-gray-200 !shadow-panel overflow-hidden"
            style={{ width: 160, height: 110 }}
          />
        )}

        <CanvasControls
          showMinimap={showMinimap}
          onToggleMinimap={() => setShowMinimap((p) => !p)}
        />
      </ReactFlow>

      {nodes.length === 0 && <EmptyCanvas />}
      <WorkflowStatsBar />
    </div>
  );
};
