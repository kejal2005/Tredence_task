import { useCallback, useRef, useEffect, useMemo } from 'react';
import {
  addEdge,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type NodeMouseHandler,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';

import {
  useCanvasActions,
  useNodes,
  useEdges,
  useHistoryActions,
} from '@store/index';
import { generateEdgeId } from '@lib/id';
import type { WorkflowNode, WorkflowEdge } from '@types-app/nodes';

export function useCanvasHandlers() {
  const nodes = useNodes();
  const edges = useEdges();
  const {
    setNodes,
    setEdges,
    selectNode,
    removeNode,
    removeEdge,
  } = useCanvasActions();
  const { pushSnapshot } = useHistoryActions();

  // Use refs to store the latest values without triggering callback recreation
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  // Use useMemo to ensure callbacks are truly stable
  const onNodesChange: OnNodesChange<WorkflowNode> = useMemo(() => {
    return (changes) => {
      const updated = applyNodeChanges(changes, nodesRef.current);
      setNodes(updated);

      // Only push snapshot on drag stop or delete
      const hasDragStop = changes.some((c) => c.type === 'position' && !c.dragging);
      const hasDelete = changes.some((c) => c.type === 'remove');
      
      if (hasDragStop || hasDelete) {
        pushSnapshot({ nodes: updated, edges: edgesRef.current });
      }
    };
  }, [setNodes, pushSnapshot]);

  // ── Edge changes ──────────────────────────────────────────────────────────
  const onEdgesChange: OnEdgesChange<WorkflowEdge> = useMemo(() => {
    return (changes) => {
      const updated = applyEdgeChanges(changes, edgesRef.current);
      setEdges(updated);
    };
  }, [setEdges]);

  // ── New connection drawn ──────────────────────────────────────────────────
  const onConnect: OnConnect = useMemo(() => {
    return (connection) => {
      const newEdge: WorkflowEdge = {
        ...connection,
        id:           generateEdgeId(connection.source, connection.target),
        type:         'smoothstep',
        animated:     false,
        style:        { stroke: '#94a3b8', strokeWidth: 2 },
        markerEnd:    { type: 'arrowclosed' as const, color: '#94a3b8' },
        source:       connection.source,
        target:       connection.target,
        sourceHandle: connection.sourceHandle ?? null,
        targetHandle: connection.targetHandle ?? null,
      };
      const updated = addEdge(newEdge, edgesRef.current);
      setEdges(updated);
      pushSnapshot({ nodes: nodesRef.current, edges: updated });
    };
  }, [setEdges, pushSnapshot]);

  // ── Node click → select ───────────────────────────────────────────────────
  const onNodeClick: NodeMouseHandler<WorkflowNode> = useCallback(
    (_event, node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  // ── Pane click → deselect ─────────────────────────────────────────────────
  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  // ── Delete node ───────────────────────────────────────────────────────────
  const onDeleteNode = useCallback(
    (id: string) => {
      removeNode(id);
      pushSnapshot({
        nodes: nodesRef.current.filter((n) => n.id !== id),
        edges: edgesRef.current.filter((e) => e.source !== id && e.target !== id),
      });
    },
    [removeNode, pushSnapshot]
  );

  // ── Delete edge ───────────────────────────────────────────────────────────
  const onDeleteEdge = useCallback(
    (id: string) => {
      removeEdge(id);
      pushSnapshot({ nodes: nodesRef.current, edges: edgesRef.current.filter((e) => e.id !== id) });
    },
    [removeEdge, pushSnapshot]
  );

  return {
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onPaneClick,
    onDeleteNode,
    onDeleteEdge,
  };
}
