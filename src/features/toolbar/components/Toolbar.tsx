import React, { useRef } from 'react';
import { Download, Upload, Play, Keyboard, Workflow } from 'lucide-react';
import { Button }  from '@components/ui/Button';
import { Tooltip } from '@components/ui/Tooltip';
import { Badge }   from '@components/ui/Badge';
import {
  useNodes, useEdges, useCanvasActions,
  useSimulatorActions, useWorkflowMeta,
  useSimulatorStatus,
} from '@store/index';
import { useUIStore }   from '@store/uiStore';
import { useSimulator } from '@features/simulator/hooks/useSimulator';
import { useWorkflowValidator } from '@features/validator/hooks/useWorkflowValidator';
import type { WorkflowGraph } from '@types-app/nodes';

export const Toolbar: React.FC = () => {
  const nodes          = useNodes();
  const edges          = useEdges();
  const meta           = useWorkflowMeta();
  const { setNodes, setEdges } = useCanvasActions();
  const { openDrawer } = useSimulatorActions();
  const simStatus      = useSimulatorStatus();
  const { run }        = useSimulator();
  const { toggleShortcuts } = useUIStore();
  const { validate }   = useWorkflowValidator();
  const fileInputRef   = useRef<HTMLInputElement>(null);

  const validation = validate();
  const errCount   = validation.errors.length;
  const wrnCount   = validation.warnings.length;

  const handleExport = () => {
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
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const graph = JSON.parse(evt.target?.result as string) as WorkflowGraph;
        if (!graph.nodes || !graph.edges) throw new Error('Invalid file');
        setNodes(graph.nodes);
        setEdges(graph.edges);
      } catch {
        alert('Invalid workflow JSON file. Please upload a valid export.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSimulate = () => {
    openDrawer();
    run();
  };

  const isRunning = simStatus === 'running';
  const hasNodes  = nodes.length > 0;

  return (
    <header className="flex h-12 items-center justify-between border-b border-gray-200 bg-white px-4">
      {/* Left: logo + name */}
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Workflow className="h-3.5 w-3.5" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">{meta.name}</span>
          {meta.description && (
            <span className="hidden text-xs text-gray-400 md:block">
              — {meta.description}
            </span>
          )}
        </div>

        {/* Validation pills — only show when there's something to report */}
        {hasNodes && errCount > 0 && (
          <Badge variant="danger">{errCount} error{errCount > 1 ? 's' : ''}</Badge>
        )}
        {hasNodes && errCount === 0 && wrnCount > 0 && (
          <Badge variant="warning">{wrnCount} warning{wrnCount > 1 ? 's' : ''}</Badge>
        )}
        {hasNodes && errCount === 0 && wrnCount === 0 && (
          <Badge variant="success">Valid</Badge>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleImport}
        />

        <Tooltip content="Import workflow (Ctrl+I)" side="bottom">
          <Button
            variant="outline" size="sm"
            onClick={() => fileInputRef.current?.click()}
            iconLeft={<Upload className="h-3.5 w-3.5" />}
          >
            Import
          </Button>
        </Tooltip>

        <Tooltip content="Export workflow (Ctrl+E)" side="bottom">
          <Button
            variant="outline" size="sm"
            onClick={handleExport}
            disabled={!hasNodes}
            iconLeft={<Download className="h-3.5 w-3.5" />}
          >
            Export
          </Button>
        </Tooltip>

        <Tooltip content="Keyboard shortcuts (?)" side="bottom">
          <Button
            variant="ghost" size="sm"
            onClick={toggleShortcuts}
          >
            <Keyboard className="h-3.5 w-3.5" />
          </Button>
        </Tooltip>

        <div className="mx-1 h-5 w-px bg-gray-200" />

        <Tooltip content={!validation.isValid ? 'Fix errors to simulate' : 'Run simulation (Ctrl+Enter)'} side="bottom">
          <Button
            variant="primary" size="sm"
            onClick={handleSimulate}
            disabled={!hasNodes || isRunning}
            loading={isRunning}
            iconLeft={!isRunning ? <Play className="h-3.5 w-3.5" /> : undefined}
          >
            {isRunning ? 'Simulating…' : 'Simulate'}
          </Button>
        </Tooltip>
      </div>
    </header>
  );
};
