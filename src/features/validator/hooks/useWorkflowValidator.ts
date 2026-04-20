import { useCallback } from 'react';
import { useNodes, useEdges } from '@store/index';
import type { ValidationResult, ValidationIssue } from '@types-app/validation';
import { generateId } from '@lib/id';

export function useWorkflowValidator() {
  const nodes = useNodes();
  const edges = useEdges();

  const validate = useCallback((): ValidationResult => {
    const issues: ValidationIssue[] = [];

    // ── Rule 1: Must have at least one Start node ───────────────────────────
    const startNodes = nodes.filter((n) => n.type === 'start');
    if (startNodes.length === 0) {
      issues.push({
        id:       generateId('issue'),
        severity: 'error',
        code:     'MISSING_START_NODE',
        message:  'Workflow must have at least one Start node.',
      });
    }

    // ── Rule 2: Must have at least one End node ─────────────────────────────
    const endNodes = nodes.filter((n) => n.type === 'end');
    if (endNodes.length === 0) {
      issues.push({
        id:       generateId('issue'),
        severity: 'error',
        code:     'MISSING_END_NODE',
        message:  'Workflow must have at least one End node.',
      });
    }

    // ── Rule 3: Multiple start nodes ────────────────────────────────────────
    if (startNodes.length > 1) {
      issues.push({
        id:       generateId('issue'),
        severity: 'warning',
        code:     'MULTIPLE_START_NODES',
        message:  `Found ${startNodes.length} Start nodes. Only one is recommended.`,
      });
    }

    // ── Rule 4: Disconnected nodes ──────────────────────────────────────────
    if (nodes.length > 1) {
      const connectedIds = new Set<string>();
      for (const edge of edges) {
        connectedIds.add(edge.source);
        connectedIds.add(edge.target);
      }
      for (const node of nodes) {
        const isStart = node.type === 'start';
        const isEnd   = node.type === 'end';
        // Start nodes only need an outgoing edge; end nodes only need incoming
        const hasOutgoing = edges.some((e) => e.source === node.id);
        const hasIncoming = edges.some((e) => e.target === node.id);

        if (isStart && !hasOutgoing && nodes.length > 1) {
          issues.push({
            id:       generateId('issue'),
            nodeId:   node.id,
            severity: 'warning',
            code:     'DISCONNECTED_NODE',
            message:  `Start node "${(node.data as Record<string, unknown>).title ?? node.id}" has no outgoing connections.`,
          });
        } else if (isEnd && !hasIncoming && nodes.length > 1) {
          issues.push({
            id:       generateId('issue'),
            nodeId:   node.id,
            severity: 'warning',
            code:     'DISCONNECTED_NODE',
            message:  `End node has no incoming connections.`,
          });
        } else if (!isStart && !isEnd && !connectedIds.has(node.id)) {
          issues.push({
            id:       generateId('issue'),
            nodeId:   node.id,
            severity: 'error',
            code:     'DISCONNECTED_NODE',
            message:  `Node "${(node.data as Record<string, unknown>).title ?? node.id}" is not connected to the workflow.`,
          });
        }
      }
    }

    // ── Rule 5: Cycle detection via DFS ─────────────────────────────────────
    const adj = new Map<string, string[]>();
    for (const node of nodes) adj.set(node.id, []);
    for (const edge of edges) adj.get(edge.source)?.push(edge.target);

    const WHITE = 0, GRAY = 1, BLACK = 2;
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
      issues.push({
        id:       generateId('issue'),
        severity: 'error',
        code:     'CYCLE_DETECTED',
        message:  'Workflow contains a cycle. Circular connections are not allowed.',
      });
    }

    // ── Rule 6: Required fields on nodes ────────────────────────────────────
    for (const node of nodes) {
      const d = node.data as Record<string, unknown>;
      if (node.type === 'approval' && !d.approverRole) {
        issues.push({
          id:       generateId('issue'),
          nodeId:   node.id,
          severity: 'warning',
          code:     'MISSING_REQUIRED_FIELD',
          message:  `Approval node "${d.title ?? node.id}" has no approver role set.`,
        });
      }
      if (node.type === 'automated' && !d.actionId) {
        issues.push({
          id:       generateId('issue'),
          nodeId:   node.id,
          severity: 'warning',
          code:     'MISSING_REQUIRED_FIELD',
          message:  `Automated node "${d.title ?? node.id}" has no action selected.`,
        });
      }
    }

    const errors   = issues.filter((i) => i.severity === 'error');
    const warnings = issues.filter((i) => i.severity === 'warning');

    return {
      isValid: errors.length === 0,
      issues,
      errors,
      warnings,
    };
  }, [nodes, edges]);

  return { validate };
}
