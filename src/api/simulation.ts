import type {
  SimulateRequest,
  SimulateResponse,
  SimulationStep,
  StepStatus,
} from '@types-app/api';
import { generateId } from '@lib/id';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function randomDuration(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildAdjacency(
  edges: SimulateRequest['edges']
): Map<string, string[]> {
  const map = new Map<string, string[]>();
  for (const edge of edges) {
    if (!map.has(edge.source)) map.set(edge.source, []);
    map.get(edge.source)!.push(edge.target);
  }
  return map;
}

/** Topological sort via Kahn's algorithm — returns ordered node IDs */
function topoSort(
  nodes: SimulateRequest['nodes'],
  edges: SimulateRequest['edges']
): string[] | null {
  const inDegree = new Map<string, number>();
  const adj      = new Map<string, string[]>();

  for (const n of nodes) {
    inDegree.set(n.id, 0);
    adj.set(n.id, []);
  }

  for (const e of edges) {
    adj.get(e.source)?.push(e.target);
    inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
  }

  const queue  = nodes.filter((n) => inDegree.get(n.id) === 0).map((n) => n.id);
  const sorted: string[] = [];

  while (queue.length > 0) {
    const id = queue.shift()!;
    sorted.push(id);
    for (const neighbor of adj.get(id) ?? []) {
      const deg = (inDegree.get(neighbor) ?? 1) - 1;
      inDegree.set(neighbor, deg);
      if (deg === 0) queue.push(neighbor);
    }
  }

  return sorted.length === nodes.length ? sorted : null; // null = cycle detected
}

// ─────────────────────────────────────────────
// Per-node execution simulation
// ─────────────────────────────────────────────

interface NodeExecResult {
  status:     StepStatus;
  message:    string;
  durationMs: number;
  output?:    Record<string, unknown>;
}

async function simulateNode(
  node: SimulateRequest['nodes'][number]
): Promise<NodeExecResult> {
  const type = node.type;
  const data = node.data as Record<string, unknown>;

  switch (type) {
    case 'start': {
      const ms = randomDuration(50, 120);
      await delay(ms);
      return {
        status:     'success',
        message:    `Workflow initiated: "${data.title ?? 'Start'}"`,
        durationMs: ms,
        output:     { triggeredAt: new Date().toISOString(), metadata: data.metadata },
      };
    }

    case 'task': {
      const ms = randomDuration(200, 600);
      await delay(ms);
      const assignee = data.assignee as string || 'Unassigned';
      // Simulate 10% chance of error for realism
      if (Math.random() < 0.1) {
        return {
          status:     'error',
          message:    `Task "${data.title}" failed: assignee "${assignee}" not found in directory.`,
          durationMs: ms,
        };
      }
      return {
        status:     'success',
        message:    `Task "${data.title}" assigned to ${assignee}${data.dueDate ? ` · Due ${data.dueDate}` : ''}.`,
        durationMs: ms,
        output:     { taskId: generateId('task'), assignee, status: 'pending' },
      };
    }

    case 'approval': {
      const ms              = randomDuration(300, 700);
      await delay(ms);
      const threshold       = Number(data.autoApproveThreshold ?? 0);
      const score           = Math.floor(Math.random() * 100);
      const autoApproved    = threshold > 0 && score >= threshold;
      const role            = data.approverRole as string || 'Approver';

      return {
        status:     'success',
        message:    autoApproved
          ? `Auto-approved (score ${score}% ≥ threshold ${threshold}%) — bypassed ${role}.`
          : `Approval request sent to ${role}. Awaiting manual decision.`,
        durationMs: ms,
        output:     { approvalId: generateId('appr'), autoApproved, score, role },
      };
    }

    case 'automated': {
      const ms         = randomDuration(150, 450);
      await delay(ms);
      const actionLabel = data.actionLabel as string || data.actionId as string || 'Unknown action';
      const params      = data.parameters as Record<string, string> ?? {};
      // Simulate 5% failure
      if (Math.random() < 0.05) {
        return {
          status:     'error',
          message:    `Automated action "${actionLabel}" failed: upstream service returned 503.`,
          durationMs: ms,
        };
      }
      return {
        status:     'success',
        message:    `Executed: ${actionLabel}${Object.keys(params).length > 0 ? ` with ${Object.keys(params).length} parameter(s)` : ''}.`,
        durationMs: ms,
        output:     { executionId: generateId('exec'), action: actionLabel, params },
      };
    }

    case 'end': {
      const ms = randomDuration(40, 100);
      await delay(ms);
      return {
        status:     'success',
        message:    (data.message as string) || 'Workflow completed successfully.',
        durationMs: ms,
        output:     {
          completedAt:  new Date().toISOString(),
          showSummary:  data.showSummary ?? true,
        },
      };
    }

    default: {
      const ms = randomDuration(50, 100);
      await delay(ms);
      return {
        status:  'skipped',
        message: `Unknown node type "${type}" — skipped.`,
        durationMs: ms,
      };
    }
  }
}

// ─────────────────────────────────────────────
// Main simulate function
// ─────────────────────────────────────────────

export async function simulateWorkflow(
  request: SimulateRequest,
  /** Called after each step so the UI can stream results live */
  onStep: (step: SimulationStep) => void
): Promise<SimulateResponse> {
  const { nodes, edges, workflowId } = request;

  // 1. Topological sort
  const ordered = topoSort(nodes, edges);
  if (!ordered) {
    throw new Error('Cycle detected in workflow graph. Please remove circular connections.');
  }

  // 2. Build node lookup
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // 3. Execute each node in topological order
  const steps: SimulationStep[] = [];
  let hasError = false;

  for (const nodeId of ordered) {
    const node = nodeMap.get(nodeId);
    if (!node) continue;

    // If a previous step errored, mark remaining as skipped
    if (hasError) {
      const skipped: SimulationStep = {
        stepId:     generateId('step'),
        nodeId:     node.id,
        nodeType:   node.type,
        label:      (node.data as Record<string, unknown>).title as string
                    ?? node.type,
        status:     'skipped',
        message:    'Skipped due to upstream error.',
        durationMs: 0,
      };
      steps.push(skipped);
      onStep(skipped);
      continue;
    }

    // Emit a "running" event first so the UI shows the spinner
    const running: SimulationStep = {
      stepId:     generateId('step'),
      nodeId:     node.id,
      nodeType:   node.type,
      label:      (node.data as Record<string, unknown>).title as string
                  ?? node.type,
      status:     'running',
      message:    'Executing…',
      durationMs: 0,
    };
    onStep(running);

    // Execute
    const result = await simulateNode(node);

    const completed: SimulationStep = {
      ...running,
      status:     result.status,
      message:    result.message,
      durationMs: result.durationMs,
      output:     result.output,
    };

    steps.push(completed);
    onStep(completed);

    if (result.status === 'error') hasError = true;
  }

  const finalStatus = hasError ? 'failed' : 'completed';

  return {
    simulationId: generateId('sim'),
    status:       finalStatus,
    totalSteps:   steps.length,
    steps,
    executedAt:   new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────
// Named export used by the simulator hook
// ─────────────────────────────────────────────
export const simulationApi = { simulateWorkflow };
