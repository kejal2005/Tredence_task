import type { Node, Edge } from '@xyflow/react';

// ─────────────────────────────────────────────
// Node Type Literals
// ─────────────────────────────────────────────

export const NODE_TYPES = {
  START:     'start',
  TASK:      'task',
  APPROVAL:  'approval',
  AUTOMATED: 'automated',
  END:       'end',
} as const;

export type NodeType = (typeof NODE_TYPES)[keyof typeof NODE_TYPES];

// ─────────────────────────────────────────────
// Shared
// ─────────────────────────────────────────────

export interface KeyValuePair {
  key:   string;
  value: string;
}

// ─────────────────────────────────────────────
// Per-Node Data Shapes (discriminated union)
// ─────────────────────────────────────────────

export interface StartNodeData extends Record<string, unknown> {
  nodeType:  typeof NODE_TYPES.START;
  title:     string;
  metadata:  KeyValuePair[];
}

export interface TaskNodeData extends Record<string, unknown> {
  nodeType:     typeof NODE_TYPES.TASK;
  title:        string;
  description:  string;
  assignee:     string;
  dueDate:      string;
  customFields: KeyValuePair[];
}

export interface ApprovalNodeData extends Record<string, unknown> {
  nodeType:              typeof NODE_TYPES.APPROVAL;
  title:                 string;
  approverRole:          string;
  autoApproveThreshold:  number;
}

export interface AutomatedNodeData extends Record<string, unknown> {
  nodeType:    typeof NODE_TYPES.AUTOMATED;
  title:       string;
  actionId:    string;
  actionLabel: string;
  parameters:  Record<string, string>;
}

export interface EndNodeData extends Record<string, unknown> {
  nodeType:       typeof NODE_TYPES.END;
  message:        string;
  showSummary:    boolean;
}

// Discriminated union — TypeScript narrows from this in switch statements
export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

// ─────────────────────────────────────────────
// React Flow Node / Edge extensions
// ─────────────────────────────────────────────

export type WorkflowNode = Node<WorkflowNodeData, NodeType>;
export type WorkflowEdge = Edge;

// ─────────────────────────────────────────────
// Graph (serializable)
// ─────────────────────────────────────────────

export interface WorkflowGraph {
  id:          string;
  name:        string;
  description: string;
  nodes:       WorkflowNode[];
  edges:       WorkflowEdge[];
  createdAt:   string;
  updatedAt:   string;
}
