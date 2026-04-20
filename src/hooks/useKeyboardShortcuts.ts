import { useEffect } from 'react';
import {
  useCanvasActions, useSelectedNodeId,
  useHistoryActions, useNodes, useEdges,
  useSimulatorActions, useWorkflowMeta,
} from '@store/index';
import { useUIStore }   from '@store/uiStore';
import { useSimulator } from '@features/simulator/hooks/useSimulator';
import type { WorkflowGraph } from '@types-app/nodes';

export function useKeyboardShortcuts() {
  const selectedNodeId                     = useSelectedNodeId();
  const { removeNode, setNodes, setEdges } = useCanvasActions();
  const { undo, redo, pushSnapshot }       = useHistoryActions();
  const { openDrawer }                     = useSimulatorActions();
  const { toggleShortcuts }                = useUIStore();
  const nodes = useNodes();
  const edges = useEdges();
  const meta  = useWorkflowMeta();
  const { run } = useSimulator();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag    = (e.target as HTMLElement).tagName;
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag);

      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const ctrl  = isMac ? e.metaKey : e.ctrlKey;

      // ── ? → shortcut cheatsheet (not while typing) ────────────────────────
      if (!typing && e.key === '?' && !ctrl) {
        toggleShortcuts();
        return;
      }

      // ── Escape → dismiss shortcuts ─────────────────────────────────────────
      // (handled in the modal itself)

      // ── Delete / Backspace → remove selected node ─────────────────────────
      if (!typing && (e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        e.preventDefault();
        removeNode(selectedNodeId);
        pushSnapshot({
          nodes: nodes.filter((n) => n.id !== selectedNodeId),
          edges: edges.filter(
            (edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId
          ),
        });
        return;
      }

      if (!ctrl) return;

      // ── Ctrl+Z → undo ─────────────────────────────────────────────────────
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        const snapshot = undo();
        if (snapshot) { setNodes(snapshot.nodes); setEdges(snapshot.edges); }
        return;
      }

      // ── Ctrl+Shift+Z | Ctrl+Y → redo ──────────────────────────────────────
      if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        const snapshot = redo();
        if (snapshot) { setNodes(snapshot.nodes); setEdges(snapshot.edges); }
        return;
      }

      // ── Ctrl+E → export ───────────────────────────────────────────────────
      if (e.key === 'e' && nodes.length > 0) {
        e.preventDefault();
        const graph: WorkflowGraph = {
          ...meta,
          nodes,
          edges,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(graph, null, 2)], { type: 'application/json' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href     = url;
        a.download = `${meta.name.replace(/\s+/g, '-').toLowerCase()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        return;
      }

      // ── Ctrl+Enter → simulate ─────────────────────────────────────────────
      if (e.key === 'Enter' && nodes.length > 0) {
        e.preventDefault();
        openDrawer();
        run();
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [
    selectedNodeId, nodes, edges, meta,
    removeNode, setNodes, setEdges,
    pushSnapshot, undo, redo,
    openDrawer, run, toggleShortcuts,
  ]);
}
