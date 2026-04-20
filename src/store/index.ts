import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import type { CanvasState }       from '@types-app/store';
import type { SimulatorState }    from '@types-app/store';
import type { WorkflowMetaState } from '@types-app/store';
import type { HistoryState }      from '@types-app/store';

import { createCanvasSlice }       from './canvasSlice';
import { createSimulatorSlice }    from './simulatorSlice';
import { createWorkflowMetaSlice } from './workflowMetaSlice';
import { createHistorySlice }      from './historySlice';

// ─────────────────────────────────────────────
// Root Store Type (union of all slices)
// ─────────────────────────────────────────────

export type RootStore =
  & CanvasState
  & SimulatorState
  & WorkflowMetaState
  & HistoryState;

// ─────────────────────────────────────────────
// Store instance
// ─────────────────────────────────────────────

export const useStore = create<RootStore>()(
  devtools(
    immer((...args) => ({
      ...createCanvasSlice(...args),
      ...createSimulatorSlice(...args),
      ...createWorkflowMetaSlice(...args),
      ...createHistorySlice(...args),
    })),
    { name: 'HRWorkflowStore', enabled: import.meta.env.DEV }
  )
);

// ─────────────────────────────────────────────
// Scoped selectors (prevent unnecessary re-renders)
// Each selector subscribes only to its slice of state.
// ─────────────────────────────────────────────

// Canvas
export const useNodes          = () => useStore((s) => s.nodes);
export const useEdges          = () => useStore((s) => s.edges);
export const useSelectedNodeId = () => useStore((s) => s.selectedNodeId);
export const useSelectedNode   = () =>
  useStore((s) =>
    s.selectedNodeId ? s.nodes.find((n) => n.id === s.selectedNodeId) ?? null : null
  );

// Canvas actions (using individual selectors to prevent object recreation)
export const useAddNode        = () => useStore((s) => s.addNode);
export const useUpdateNodeData = () => useStore((s) => s.updateNodeData);
export const useRemoveNode     = () => useStore((s) => s.removeNode);
export const useSelectNode     = () => useStore((s) => s.selectNode);
export const useAddEdge        = () => useStore((s) => s.addEdge);
export const useRemoveEdge     = () => useStore((s) => s.removeEdge);
export const useSetNodes       = () => useStore((s) => s.setNodes);
export const useSetEdges       = () => useStore((s) => s.setEdges);
export const useResetCanvas    = () => useStore((s) => s.resetCanvas);

export const useCanvasActions = () => ({
  addNode:        useAddNode(),
  updateNodeData: useUpdateNodeData(),
  removeNode:     useRemoveNode(),
  selectNode:     useSelectNode(),
  addEdge:        useAddEdge(),
  removeEdge:     useRemoveEdge(),
  setNodes:       useSetNodes(),
  setEdges:       useSetEdges(),
  resetCanvas:    useResetCanvas(),
});

// Simulator
export const useSimulatorStatus   = () => useStore((s) => s.status);
export const useSimulatorSteps    = () => useStore((s) => s.steps);
export const useSimulatorError    = () => useStore((s) => s.errorMessage);
export const useSimulatorDrawer   = () => useStore((s) => s.isDrawerOpen);

// Simulator actions (using individual selectors)
export const useSetStatus      = () => useStore((s) => s.setStatus);
export const useSetSteps       = () => useStore((s) => s.setSteps);
export const useSetError       = () => useStore((s) => s.setError);
export const useOpenDrawer     = () => useStore((s) => s.openDrawer);
export const useCloseDrawer    = () => useStore((s) => s.closeDrawer);
export const useResetSimulator = () => useStore((s) => s.resetSimulator);

export const useSimulatorActions  = () => ({
  setStatus:      useSetStatus(),
  setSteps:       useSetSteps(),
  setError:       useSetError(),
  openDrawer:     useOpenDrawer(),
  closeDrawer:    useCloseDrawer(),
  resetSimulator: useResetSimulator(),
});

// Workflow meta
export const useWorkflowMeta    = () => useStore((s) => s.meta);
export const useSetWorkflowMeta = () => useStore((s) => s.setMeta);

// History
export const useCanUndo = () => useStore((s) => s.canUndo);
export const useCanRedo = () => useStore((s) => s.canRedo);

// History actions (using individual selectors)
export const usePushSnapshot = () => useStore((s) => s.pushSnapshot);
export const useUndo         = () => useStore((s) => s.undo);
export const useRedo         = () => useStore((s) => s.redo);
export const useClearHistory = () => useStore((s) => s.clearHistory);

export const useHistoryActions = () => ({
  pushSnapshot: usePushSnapshot(),
  undo:         useUndo(),
  redo:         useRedo(),
  clearHistory: useClearHistory(),
});
