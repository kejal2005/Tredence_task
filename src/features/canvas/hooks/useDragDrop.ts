import { useCallback, useRef } from 'react';
import { useReactFlow } from '@xyflow/react';
import { useCanvasActions, useNodes, useEdges, useHistoryActions } from '@store/index';
import { generateId } from '@lib/id';
import { NODE_DEFAULTS } from '@features/nodes/config/nodeConfig';
import type { NodeType, WorkflowNode, WorkflowNodeData } from '@types-app/nodes';

export function useDragDrop() {
  const reactFlowWrapper              = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition }      = useReactFlow();
  const { addNode }                   = useCanvasActions();
  const { pushSnapshot }              = useHistoryActions();
  const nodes                         = useNodes();
  const edges                         = useEdges();

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const nodeType = e.dataTransfer.getData('application/reactflow-nodetype') as NodeType;
      if (!nodeType) return;

      const position  = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const id        = generateId(nodeType);
      const defaults  = NODE_DEFAULTS[nodeType] as Omit<WorkflowNodeData, 'nodeType'>;

      const newNode: WorkflowNode = {
        id,
        type:     nodeType,
        position,
        data:     { ...defaults, nodeType } as WorkflowNodeData,
        selected: false,
        dragging: false,
      };

      addNode(newNode);
      pushSnapshot({ nodes: [...nodes, newNode], edges });
    },
    [screenToFlowPosition, addNode, pushSnapshot, nodes, edges]
  );

  return { reactFlowWrapper, onDragOver, onDrop };
}
