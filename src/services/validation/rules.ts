/**
 * Validation Rules Module
 *
 * Extracts validation logic into individual, testable rules.
 * Each rule is a pure function that takes (nodes, edges) and returns violations.
 *
 * Benefits:
 * - Rules are independently testable
 * - Easy to disable/enable specific rules
 * - Easy to add new rules without modifying hook
 * - Clear separation of concerns
 */

import { generateId } from '@lib/id';
import type { ValidationIssue } from '@types-app/validation';
import type { WorkflowNode, WorkflowEdge } from '@types-app/nodes';

// ─────────────────────────────────────────────
// Rule Type Definition
// ─────────────────────────────────────────────

export type ValidationRule = (
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
) => ValidationIssue[];

// ─────────────────────────────────────────────
// Individual Validation Rules
// ─────────────────────────────────────────────

/**
 * RULE: Must have at least one Start node
 */
export const requireStartNodeRule: ValidationRule = (nodes) => {
  const startNodes = nodes.filter((n) => n.type === 'start');
  if (startNodes.length === 0) {
    return [
      {
        id: generateId('issue'),
        severity: 'error',
        code: 'MISSING_START_NODE',
        message: 'Workflow must have at least one Start node.',
      },
    ];
  }
  return [];
};

/**
 * RULE: Must have at least one End node
 */
export const requireEndNodeRule: ValidationRule = (nodes) => {
  const endNodes = nodes.filter((n) => n.type === 'end');
  if (endNodes.length === 0) {
    return [
      {
        id: generateId('issue'),
        severity: 'error',
        code: 'MISSING_END_NODE',
        message: 'Workflow must have at least one End node.',
      },
    ];
  }
  return [];
};

/**
 * RULE: Should not have multiple Start nodes (warning only)
 */
export const singleStartNodeRule: ValidationRule = (nodes) => {
  const startNodes = nodes.filter((n) => n.type === 'start');
  if (startNodes.length > 1) {
    return [
      {
        id: generateId('issue'),
        severity: 'warning',
        code: 'MULTIPLE_START_NODES',
        message: `Found ${startNodes.length} Start nodes. Only one is recommended.`,
      },
    ];
  }
  return [];
};

/**
 * RULE: No cycles allowed (DAG constraint)
 * Uses DFS with white/gray/black color coding
 */
export const noCyclesRule: ValidationRule = (nodes, edges) => {
  const adj = new Map<string, string[]>();
  for (const node of nodes) adj.set(node.id, []);
  for (const edge of edges) adj.get(edge.source)?.push(edge.target);

  const WHITE = 0,
    GRAY = 1,
    BLACK = 2;
  const color = new Map(nodes.map((n) => [n.id, WHITE]));
  let cycleFound = false;

  const dfs = (id: string): boolean => {
    color.set(id, GRAY);
    for (const neighbor of adj.get(id) ?? []) {
      if (color.get(neighbor) === GRAY) return true;
      if (color.get(neighbor) === WHITE && dfs(neighbor)) return true;
    }
    color.set(id, BLACK);
    return false;
  };

  for (const node of nodes) {
    if (color.get(node.id) === WHITE && dfs(node.id)) {
      cycleFound = true;
      break;
    }
  }

  if (cycleFound) {
    return [
      {
        id: generateId('issue'),
        severity: 'error',
        code: 'CYCLE_DETECTED',
        message: 'Workflow contains a cycle. Circular connections are not allowed.',
      },
    ];
  }
  return [];
};

/**
 * RULE: No disconnected nodes (except when only 1 node exists)
 * Start nodes only need outgoing edges, End nodes only need incoming
 */
export const noDisconnectedNodesRule: ValidationRule = (nodes, edges) => {
  const issues: ValidationIssue[] = [];

  if (nodes.length <= 1) return issues;

  const connectedIds = new Set<string>();
  for (const edge of edges) {
    connectedIds.add(edge.source);
    connectedIds.add(edge.target);
  }

  for (const node of nodes) {
    const isStart = node.type === 'start';
    const isEnd = node.type === 'end';
    const hasOutgoing = edges.some((e) => e.source === node.id);
    const hasIncoming = edges.some((e) => e.target === node.id);
    const nodeTitle = (node.data as Record<string, unknown>).title ?? node.id;

    if (isStart && !hasOutgoing) {
      issues.push({
        id: generateId('issue'),
        nodeId: node.id,
        severity: 'warning',
        code: 'DISCONNECTED_NODE',
        message: `Start node "${nodeTitle}" has no outgoing connections.`,
      });
    } else if (isEnd && !hasIncoming) {
      issues.push({
        id: generateId('issue'),
        nodeId: node.id,
        severity: 'warning',
        code: 'DISCONNECTED_NODE',
        message: `End node "${nodeTitle}" has no incoming connections.`,
      });
    } else if (!isStart && !isEnd && !connectedIds.has(node.id)) {
      issues.push({
        id: generateId('issue'),
        nodeId: node.id,
        severity: 'error',
        code: 'DISCONNECTED_NODE',
        message: `Node "${nodeTitle}" is not connected to the workflow.`,
      });
    }
  }

  return issues;
};

/**
 * RULE: Approval nodes must have approverRole set
 */
export const approvalNodeRequiredFieldsRule: ValidationRule = (nodes) => {
  const issues: ValidationIssue[] = [];

  for (const node of nodes) {
    if (node.type === 'approval') {
      const data = node.data as Record<string, unknown>;
      if (!data.approverRole) {
        issues.push({
          id: generateId('issue'),
          nodeId: node.id,
          severity: 'warning',
          code: 'MISSING_REQUIRED_FIELD',
          message: `Approval node "${data.title ?? node.id}" has no approver role set.`,
        });
      }
    }
  }

  return issues;
};

/**
 * RULE: Automated nodes must have actionId set
 */
export const automatedNodeRequiredFieldsRule: ValidationRule = (nodes) => {
  const issues: ValidationIssue[] = [];

  for (const node of nodes) {
    if (node.type === 'automated') {
      const data = node.data as Record<string, unknown>;
      if (!data.actionId) {
        issues.push({
          id: generateId('issue'),
          nodeId: node.id,
          severity: 'warning',
          code: 'MISSING_REQUIRED_FIELD',
          message: `Automated node "${data.title ?? node.id}" has no action selected.`,
        });
      }
    }
  }

  return issues;
};

// ─────────────────────────────────────────────
// Validation Rule Registry
// ─────────────────────────────────────────────

/**
 * All validation rules, in order of execution.
 * Add/remove rules here to customize validation behavior.
 */
export const VALIDATION_RULES: ValidationRule[] = [
  requireStartNodeRule,
  requireEndNodeRule,
  singleStartNodeRule,
  noCyclesRule,
  noDisconnectedNodesRule,
  approvalNodeRequiredFieldsRule,
  automatedNodeRequiredFieldsRule,
];

/**
 * Run all validation rules and collect issues
 */
export function runValidationRules(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  rules: ValidationRule[] = VALIDATION_RULES
): ValidationIssue[] {
  const allIssues: ValidationIssue[] = [];

  for (const rule of rules) {
    const ruleIssues = rule(nodes, edges);
    allIssues.push(...ruleIssues);
  }

  return allIssues;
}
