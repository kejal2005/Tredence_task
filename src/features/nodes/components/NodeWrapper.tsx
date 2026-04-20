import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Trash2, Zap } from 'lucide-react';
import { cn } from '@lib/cn';
import { useCanvasHandlers } from '@features/canvas/hooks/useCanvasHandlers';
import { NODE_VISUAL_CONFIG } from '../config/nodeConfig';
import type { WorkflowNode } from '@types-app/nodes';

interface NodeWrapperProps extends NodeProps<WorkflowNode> {
  children: React.ReactNode;
}

export const NodeWrapper: React.FC<NodeWrapperProps> = ({
  data, selected, children,
}) => {
  const { onDeleteNode } = useCanvasHandlers();
  const config = NODE_VISUAL_CONFIG[data.nodeType];

  if (!config) {
    return (
      <div className="rounded-lg border-2 border-red-500 bg-red-50 px-3 py-2 text-xs text-red-600">
        Unknown node type
      </div>
    );
  }

  // Type narrowing - get the specific property
  const getDataValue = (key: string, fallback: string = ''): string => {
    const value = (data as Record<string, unknown>)[key];
    return value ? String(value) : fallback;
  };

  const title = getDataValue('title', config.label);
  const actionId = (data as Record<string, unknown>).actionId;
  const actionLabel = getDataValue('actionLabel', '');

  const deleteButton = selected && data.id ? React.createElement(
    'button',
    {
      onClick: () => onDeleteNode(String(data.id)),
      className: cn(
        'flex-shrink-0 rounded-lg p-1 transition-colors',
        'text-red-600 hover:bg-red-100 active:bg-red-200',
        'opacity-0 group-hover:opacity-100'
      ),
      title: 'Delete node',
    },
    React.createElement(Trash2, { className: 'h-3.5 w-3.5' })
  ) : null;

  const statusIndicator = data.nodeType === 'automated' && actionId ? React.createElement(
    'div',
    { className: 'mt-1.5 flex items-center gap-1 text-xs text-violet-600' },
    React.createElement(Zap, { className: 'h-3 w-3' }),
    React.createElement(
      'span',
      { className: 'truncate' },
      actionLabel
    )
  ) : null;

  return React.createElement(
    'div',
    {
      className: cn(
        'min-w-[180px] max-w-[200px] rounded-xl border-2 px-3 py-2',
        'shadow-md transition-all duration-150 relative group',
        selected
          ? `${config.borderColor} ${config.color} ring-2 ring-offset-2 ring-blue-400 shadow-lg`
          : `${config.borderColor} ${config.color} hover:shadow-lg`
      ),
    },
    React.createElement(Handle, { type: 'target', position: Position.Top }),
    React.createElement(Handle, { type: 'source', position: Position.Bottom }),
    React.createElement(
      'div',
      { className: 'flex items-start justify-between gap-2' },
      React.createElement(
        'div',
        { className: 'flex-1 min-w-0' },
        React.createElement(
          'h3',
          { className: 'font-semibold text-sm truncate', title },
          title
        ),
        React.createElement(
          'p',
          { className: cn('text-xs mt-0.5', config.textColor, 'opacity-75') },
          config.label
        )
      ),
      deleteButton
    ),
    React.createElement(
      'div',
      { className: 'mt-2 text-xs' },
      children
    ),
    statusIndicator
  );
};

