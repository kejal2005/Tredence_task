import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { NodeWrapper } from './NodeWrapper';
import type { WorkflowNode } from '@types-app/nodes';

export const StartNodeComponent: React.FC<NodeProps<WorkflowNode>> = (props) => (
  <NodeWrapper {...props}>
    <div className="text-xs font-semibold text-emerald-700">Start</div>
  </NodeWrapper>
);

StartNodeComponent.displayName = 'StartNode';
