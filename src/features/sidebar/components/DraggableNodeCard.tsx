import React from 'react';
import { cn } from '@lib/cn';
import type { NodeType } from '@types-app/nodes';
import { NODE_VISUAL_CONFIG } from '@features/nodes/config/nodeConfig';

interface DraggableNodeCardProps {
  nodeType: NodeType;
}

export const DraggableNodeCard: React.FC<DraggableNodeCardProps> = ({ nodeType }) => {
  const config = NODE_VISUAL_CONFIG[nodeType];
  const Icon   = config.icon;

  const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('application/reactflow-nodetype', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={cn(
        'group flex cursor-grab items-center gap-3 rounded-xl border px-3 py-2.5',
        'transition-all duration-150 active:cursor-grabbing active:scale-95',
        'hover:shadow-md select-none',
        config.color,
        config.borderColor,
      )}
    >
      <div
        className={cn(
          'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg',
          'transition-transform duration-150 group-hover:scale-110',
        )}
        style={{ backgroundColor: config.accentHex + '22' }}
      >
        <Icon className="h-4 w-4" style={{ color: config.accentHex }} />
      </div>

      <div className="min-w-0">
        <p className={cn('text-sm font-semibold leading-none', config.textColor)}>
          {config.label}
        </p>
        <p className="mt-0.5 truncate text-xs text-gray-500 leading-tight">
          {config.description}
        </p>
      </div>
    </div>
  );
};
