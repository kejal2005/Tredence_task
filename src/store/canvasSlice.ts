import type { StateCreator } from 'zustand';
import type { CanvasState } from '@types-app/store';
import type { WorkflowNode, WorkflowEdge, WorkflowNodeData } from '@types-app/nodes';
import type { RootStore } from './index';

export const createCanvasSlice: StateCreator<
  RootStore,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  CanvasState
> = (set) => ({
  nodes:          [],
  edges:          [],
  selectedNodeId: null,

  // ── Node actions ──────────────────────────────────────────────────────────

  addNode: (node: WorkflowNode) =>
    set(
      (state) => { state.nodes.push(node); },
      false,
      'canvas/addNode'
    ),

  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) =>
    set(
      (state) => {
        const idx = state.nodes.findIndex((n) => n.id === id);
        if (idx === -1) return;
        state.nodes[idx].data = {
          ...state.nodes[idx].data,
          ...data,
        } as WorkflowNodeData;
      },
      false,
      'canvas/updateNodeData'
    ),

  removeNode: (id: string) =>
    set(
      (state) => {
        state.nodes = state.nodes.filter((n) => n.id !== id);
        // Remove all edges connected to this node
        state.edges = state.edges.filter(
          (e) => e.source !== id && e.target !== id
        );
        if (state.selectedNodeId === id) {
          state.selectedNodeId = null;
        }
      },
      false,
      'canvas/removeNode'
    ),

  selectNode: (id: string | null) =>
    set(
      (state) => { state.selectedNodeId = id; },
      false,
      'canvas/selectNode'
    ),

  // ── Edge actions ──────────────────────────────────────────────────────────

  addEdge: (edge: WorkflowEdge) =>
    set(
      (state) => {
        // Prevent duplicate edges between same source/target
        const exists = state.edges.some(
          (e) => e.source === edge.source && e.target === edge.target
        );
        if (!exists) state.edges.push(edge);
      },
      false,
      'canvas/addEdge'
    ),

  removeEdge: (id: string) =>
    set(
      (state) => { state.edges = state.edges.filter((e) => e.id !== id); },
      false,
      'canvas/removeEdge'
    ),

  // ── Bulk ──────────────────────────────────────────────────────────────────

  setNodes: (nodes: WorkflowNode[]) =>
    set(
      (state) => { state.nodes = nodes; },
      false,
      'canvas/setNodes'
    ),

  setEdges: (edges: WorkflowEdge[]) =>
    set(
      (state) => { state.edges = edges; },
      false,
      'canvas/setEdges'
    ),

  resetCanvas: () =>
    set(
      (state) => {
        state.nodes          = [];
        state.edges          = [];
        state.selectedNodeId = null;
      },
      false,
      'canvas/reset'
    ),
});
