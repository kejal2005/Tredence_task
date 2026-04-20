/**
 * Simulation Service
 *
 * Handles all simulation-related data transformation and API interaction.
 * Isolates the API layer from UI/hooks concerns.
 *
 * Responsibility:
 * - Transform node/edge data into API request format
 * - Build workflow payload
 * - Handle API calls
 * - Transform API responses back to UI types
 *
 * Benefits:
 * - Hooks stay focused on state management
 * - Components stay focused on rendering
 * - API layer is testable and mockable
 * - Easy to swap API implementation
 */

import type { WorkflowNode, WorkflowEdge } from '@types-app/nodes';
import type { SimulateRequest, SimulateResponse, SimulationStep } from '@types-app/api';

// ─────────────────────────────────────────────
// Data Transformation Functions
// ─────────────────────────────────────────────

/**
 * Transform node graph to API request format
 */
export function transformNodesToApiFormat(nodes: WorkflowNode[]) {
  return nodes.map((n) => ({
    id: n.id,
    type: n.type ?? 'unknown',
    data: n.data as Record<string, unknown>,
    position: n.position,
  }));
}

/**
 * Transform edges to API request format
 */
export function transformEdgesToApiFormat(edges: WorkflowEdge[]) {
  return edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
  }));
}

/**
 * Build complete simulation request payload
 */
export function buildSimulationRequest(
  workflowId: string,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): SimulateRequest {
  return {
    workflowId,
    nodes: transformNodesToApiFormat(nodes),
    edges: transformEdgesToApiFormat(edges),
  };
}

// ─────────────────────────────────────────────
// Simulation Execution
// ─────────────────────────────────────────────

/**
 * Execute workflow simulation via API
 *
 * @param request - Simulation request payload
 * @param onStep - Callback fired on each step (for real-time UI updates)
 * @returns - Complete simulation response
 *
 * PATTERN: onStep callback enables streaming UI updates without waiting for full completion
 * Example:
 *   const onStep = (step) => setSteps(prev => [...prev, step]);
 *   const response = await runSimulation(request, onStep);
 */
export async function runSimulation(
  request: SimulateRequest,
  onStep?: (step: SimulationStep) => void
): Promise<SimulateResponse> {
  // Import API client (abstracted here to avoid circular imports)
  const { simulateWorkflow } = await import('@api/simulation');

  try {
    const response = await simulateWorkflow(
      request,
      onStep || (() => {}) // Provide no-op if onStep not provided
    );
    return response;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Simulation failed'
    );
  }
}

// ─────────────────────────────────────────────
// Response Processing
// ─────────────────────────────────────────────

/**
 * Determine overall simulation status
 */
export function getSimulationStatus(response: SimulateResponse): 'completed' | 'error' {
  return response.status === 'completed' ? 'completed' : 'error';
}

/**
 * Extract error message if simulation failed
 */
export function getSimulationErrorMessage(response: SimulateResponse): string | null {
  if (response.status === 'failed') {
    return 'One or more steps failed during execution. See log below.';
  }
  return null;
}
