import type { WorkflowNode, WorkflowEdge, WorkflowNodeData } from './nodes';
import type { SimulationStep } from './api';

// ─────────────────────────────────────────────
// Canvas slice
// ─────────────────────────────────────────────

export interface CanvasState {
  nodes:           WorkflowNode[];
  edges:           WorkflowEdge[];
  selectedNodeId:  string | null;

  // Node CRUD
  addNode:         (node: WorkflowNode) => void;
  updateNodeData:  (id: string, data: Partial<WorkflowNodeData>) => void;
  removeNode:      (id: string) => void;
  selectNode:      (id: string | null) => void;

  // Edge CRUD
  addEdge:         (edge: WorkflowEdge) => void;
  removeEdge:      (id: string) => void;

  // Bulk
  setNodes:        (nodes: WorkflowNode[]) => void;
  setEdges:        (edges: WorkflowEdge[]) => void;
  resetCanvas:     () => void;
}

// ─────────────────────────────────────────────
// Simulator slice
// ─────────────────────────────────────────────

export type SimulatorStatus = 'idle' | 'running' | 'completed' | 'error';

export interface SimulatorState {
  status:        SimulatorStatus;
  steps:         SimulationStep[];
  errorMessage:  string | null;
  isDrawerOpen:  boolean;

  setStatus:     (status: SimulatorStatus) => void;
  setSteps:      (steps: SimulationStep[]) => void;
  setError:      (msg: string | null) => void;
  openDrawer:    () => void;
  closeDrawer:   () => void;
  resetSimulator: () => void;
}

// ─────────────────────────────────────────────
// Workflow metadata slice
// ─────────────────────────────────────────────

export interface WorkflowMeta {
  id:          string;
  name:        string;
  description: string;
}

export interface WorkflowMetaState {
  meta: WorkflowMeta;
  setMeta: (meta: Partial<WorkflowMeta>) => void;
}

// ─────────────────────────────────────────────
// History slice (undo/redo)
// ─────────────────────────────────────────────

export interface HistorySnapshot {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface HistoryState {
  past:   HistorySnapshot[];
  future: HistorySnapshot[];
  canUndo: boolean;
  canRedo: boolean;
  pushSnapshot:  (snapshot: HistorySnapshot) => void;
  undo:          () => HistorySnapshot | null;
  redo:          () => HistorySnapshot | null;
  clearHistory:  () => void;
}
