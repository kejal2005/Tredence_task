import React from 'react';
import type { NodeProps } from '@xyflow/react';
import { NodeWrapper } from './NodeWrapper';
import type { WorkflowNode } from '@types-app/nodes';

export const AutomatedNodeComponent: React.FC<NodeProps<WorkflowNode>> = (props) => (
  <NodeWrapper {...props}>
    <div className="text-xs font-semibold text-violet-700">Automated</div>
  </NodeWrapper>
);

AutomatedNodeComponent.displayName = 'AutomatedNode';

