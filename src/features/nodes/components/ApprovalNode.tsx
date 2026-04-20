import React from 'react';
import type { NodeProps } from '@xyflow/react';
import { NodeWrapper } from './NodeWrapper';
import type { WorkflowNode } from '@types-app/nodes';

export const ApprovalNodeComponent: React.FC<NodeProps<WorkflowNode>> = (props) => (
  <NodeWrapper {...props}>
    <div className="text-xs font-semibold text-amber-700">Approval</div>
  </NodeWrapper>
);

ApprovalNodeComponent.displayName = 'ApprovalNode';
