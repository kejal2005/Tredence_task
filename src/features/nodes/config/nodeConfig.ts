import {
  Play,
  CheckSquare,
  ThumbsUp,
  Zap,
  StopCircle,
  type LucideIcon,
} from 'lucide-react';
import { NODE_TYPES, type NodeType } from '@types-app/nodes';
import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedNodeData,
  EndNodeData,
} from '@types-app/nodes';

// ─────────────────────────────────────────────
// Visual config per node type
// ─────────────────────────────────────────────

export interface NodeVisualConfig {
  label:       string;
  icon:        LucideIcon;
  color:       string;       // Tailwind bg class
  borderColor: string;       // Tailwind border class
  textColor:   string;       // Tailwind text class
  accentHex:   string;       // Raw hex for SVG / inline styles
  description: string;
}

export const NODE_VISUAL_CONFIG: Record<NodeType, NodeVisualConfig> = {
  [NODE_TYPES.START]: {
    label:       'Start',
    icon:        Play,
    color:       'bg-emerald-50',
    borderColor: 'border-emerald-400',
    textColor:   'text-emerald-700',
    accentHex:   '#22c55e',
    description: 'Entry point of the workflow',
  },
  [NODE_TYPES.TASK]: {
    label:       'Task',
    icon:        CheckSquare,
    color:       'bg-blue-50',
    borderColor: 'border-blue-400',
    textColor:   'text-blue-700',
    accentHex:   '#3b82f6',
    description: 'Manual task assigned to a person',
  },
  [NODE_TYPES.APPROVAL]: {
    label:       'Approval',
    icon:        ThumbsUp,
    color:       'bg-amber-50',
    borderColor: 'border-amber-400',
    textColor:   'text-amber-700',
    accentHex:   '#f59e0b',
    description: 'Requires role-based approval',
  },
  [NODE_TYPES.AUTOMATED]: {
    label:       'Automated',
    icon:        Zap,
    color:       'bg-violet-50',
    borderColor: 'border-violet-400',
    textColor:   'text-violet-700',
    accentHex:   '#8b5cf6',
    description: 'Runs an automated action via API',
  },
  [NODE_TYPES.END]: {
    label:       'End',
    icon:        StopCircle,
    color:       'bg-red-50',
    borderColor: 'border-red-400',
    textColor:   'text-red-700',
    accentHex:   '#ef4444',
    description: 'Terminal node of the workflow',
  },
};

// ─────────────────────────────────────────────
// Default data per node type
// (used when dropping from sidebar)
// ─────────────────────────────────────────────

export const NODE_DEFAULTS: {
  [NODE_TYPES.START]:     Omit<StartNodeData,     'nodeType'>;
  [NODE_TYPES.TASK]:      Omit<TaskNodeData,       'nodeType'>;
  [NODE_TYPES.APPROVAL]:  Omit<ApprovalNodeData,   'nodeType'>;
  [NODE_TYPES.AUTOMATED]: Omit<AutomatedNodeData,  'nodeType'>;
  [NODE_TYPES.END]:       Omit<EndNodeData,        'nodeType'>;
} = {
  [NODE_TYPES.START]: {
    title:    'Start',
    metadata: [],
  },
  [NODE_TYPES.TASK]: {
    title:        'New Task',
    description:  '',
    assignee:     '',
    dueDate:      '',
    customFields: [],
  },
  [NODE_TYPES.APPROVAL]: {
    title:                'Approval Required',
    approverRole:         '',
    autoApproveThreshold: 0,
  },
  [NODE_TYPES.AUTOMATED]: {
    title:       'Automated Step',
    actionId:    '',
    actionLabel: '',
    parameters:  {},
  },
  [NODE_TYPES.END]: {
    message:     'Workflow completed.',
    showSummary: true,
  },
};

// ─────────────────────────────────────────────
// Ordered list for sidebar palette
// ─────────────────────────────────────────────

export const NODE_TYPE_ORDER: NodeType[] = [
  NODE_TYPES.START,
  NODE_TYPES.TASK,
  NODE_TYPES.APPROVAL,
  NODE_TYPES.AUTOMATED,
  NODE_TYPES.END,
];
