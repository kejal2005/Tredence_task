import React from 'react';
import { useReactFlow } from '@xyflow/react';
import {
  ZoomIn, ZoomOut, Maximize2, LayoutTemplate,
  Trash2, Undo2, Redo2, Map, Keyboard,
} from 'lucide-react';
import { Tooltip }    from '@components/ui/Tooltip';
import { cn }         from '@lib/cn';
import {
  useCanvasActions, useNodes, useEdges,
  useCanUndo, useCanRedo, useHistoryActions,
} from '@store/index';
import { useUIStore }       from '@store/uiStore';
import { applyDagreLayout } from '@lib/dagre';

interface ControlBtnProps {
  onClick:   () => void;
  tooltip:   string;
  disabled?: boolean;
  danger?:   boolean;
  active?:   boolean;
  children:  React.ReactNode;
}

const ControlBtn: React.FC<ControlBtnProps> = ({
  onClick, tooltip, disabled, danger, active, children,
}) => (
  <Tooltip content={tooltip} side="right">
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
        'disabled:pointer-events-none disabled:opacity-30',
        active
          ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
          : danger
          ? 'text-gray-600 hover:bg-red-50 hover:text-red-600'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      {children}
    </button>
  </Tooltip>
);

interface CanvasControlsProps {
  showMinimap:     boolean;
  onToggleMinimap: () => void;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
  showMinimap, onToggleMinimap,
}) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const nodes    = useNodes();
  const edges    = useEdges();
  const canUndo  = useCanUndo();
  const canRedo  = useCanRedo();
  const { setNodes, setEdges, resetCanvas } = useCanvasActions();
  const { undo, redo, pushSnapshot }        = useHistoryActions();
  const { toggleShortcuts }                 = useUIStore();

  const handleAutoLayout = () => {
    if (nodes.length === 0) return;
    const laid = applyDagreLayout(nodes, edges, 'TB');
    setNodes(laid);
    pushSnapshot({ nodes: laid, edges });
  };

  const handleUndo = () => {
    const snap = undo();
    if (snap) { setNodes(snap.nodes); setEdges(snap.edges); }
  };

  const handleRedo = () => {
    const snap = redo();
    if (snap) { setNodes(snap.nodes); setEdges(snap.edges); }
  };

  const handleClear = () => {
    if (nodes.length === 0) return;
    if (!window.confirm('Clear the entire canvas? This cannot be undone.')) return;
    resetCanvas();
  };

  const Divider = () => <div className="my-0.5 border-t border-gray-100" />;

  return (
    <div className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-panel">
      <ControlBtn onClick={() => zoomIn()}  tooltip="Zoom in">
        <ZoomIn className="h-4 w-4" />
      </ControlBtn>
      <ControlBtn onClick={() => zoomOut()} tooltip="Zoom out">
        <ZoomOut className="h-4 w-4" />
      </ControlBtn>
      <ControlBtn onClick={() => fitView({ padding: 0.2 })} tooltip="Fit view">
        <Maximize2 className="h-4 w-4" />
      </ControlBtn>

      <Divider />

      <ControlBtn onClick={handleUndo} disabled={!canUndo} tooltip="Undo (Ctrl+Z)">
        <Undo2 className="h-4 w-4" />
      </ControlBtn>
      <ControlBtn onClick={handleRedo} disabled={!canRedo} tooltip="Redo (Ctrl+Y)">
        <Redo2 className="h-4 w-4" />
      </ControlBtn>

      <Divider />

      <ControlBtn
        onClick={handleAutoLayout}
        disabled={nodes.length === 0}
        tooltip="Auto layout (Dagre TB)"
      >
        <LayoutTemplate className="h-4 w-4" />
      </ControlBtn>

      <ControlBtn
        onClick={onToggleMinimap}
        tooltip={showMinimap ? 'Hide minimap' : 'Show minimap'}
        active={showMinimap}
      >
        <Map className="h-4 w-4" />
      </ControlBtn>

      <Divider />

      <ControlBtn onClick={toggleShortcuts} tooltip="Keyboard shortcuts (?)">
        <Keyboard className="h-4 w-4" />
      </ControlBtn>

      <Divider />

      <ControlBtn
        onClick={handleClear}
        disabled={nodes.length === 0}
        tooltip="Clear canvas"
        danger
      >
        <Trash2 className="h-4 w-4" />
      </ControlBtn>
    </div>
  );
};
