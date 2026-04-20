import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@lib/cn';
import { NODE_VISUAL_CONFIG } from '@features/nodes/config/nodeConfig';
import { useCanvasActions } from '@store/index';
import type { NodeType } from '@types-app/nodes';

interface PanelHeaderProps {
  nodeType?: NodeType;
  nodeId?:   string;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({ nodeType, nodeId }) => {
  const { selectNode } = useCanvasActions();

  if (!nodeType) {
    return (
      <div className="border-b border-gray-100 px-4 py-3">
        <p className="text-sm font-semibold text-gray-600">Configuration</p>
      </div>
    );
  }

  const config = NODE_VISUAL_CONFIG[nodeType];
  const Icon = config.icon;

  return (
    <div className={cn('flex items-center gap-3 border-b border-gray-100 px-4 py-3.5')}>
      <div
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: config.accentHex }}
      >
        <Icon className="h-4 w-4 text-white" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Configure
        </p>
        <p className={cn('text-sm font-bold truncate text-gray-900')}>
          {config.label}
        </p>
      </div>

      {nodeId && (
        <button
          onClick={() => selectNode(null)}
          className={cn(
            'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg',
            'text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
          )}
          title="Close panel"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
