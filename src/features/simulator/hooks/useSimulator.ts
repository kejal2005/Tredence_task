import { useCallback, useRef } from 'react';
import {
  useNodes,
  useEdges,
  useWorkflowMeta,
  useSimulatorActions,
} from '@store/index';
import { useWorkflowValidator } from '@features/validator/hooks/useWorkflowValidator';
import {
  buildSimulationRequest,
  runSimulation,
  getSimulationStatus,
  getSimulationErrorMessage,
} from '@services/simulation';
import type { SimulationStep } from '@types-app/api';

/**
 * REFACTORED: Uses simulation service for data transformation and API calls
 *
 * BEFORE: Hook was mixing concerns
 *   - Data transformation (nodes/edges → API format)
 *   - API calls
 *   - Response handling
 *   - State updates
 *
 * AFTER: Clean separation
 *   - Hook focuses on: validation, state orchestration, error handling
 *   - Service handles: data transformation, API interaction
 *   - UI effects are clear and isolated
 *
 * Benefits:
 * - Service layer is independently testable
 * - Hook is simpler and easier to understand
 * - API changes don't require hook changes
 * - Streaming step updates are centralized
 */
export function useSimulator() {
  const nodes = useNodes();
  const edges = useEdges();
  const meta = useWorkflowMeta();

  const {
    setStatus,
    setSteps,
    setError,
    openDrawer,
    resetSimulator,
  } = useSimulatorActions();

  const { validate } = useWorkflowValidator();

  // Buffer for streaming steps into store without batching lag
  const stepBufferRef = useRef<SimulationStep[]>([]);

  const run = useCallback(async () => {
    // 1. Validate graph first
    const validation = validate();
    if (!validation.isValid) {
      openDrawer();
      setStatus('error');
      setError(
        validation.errors.map((e) => e.message).join('\n')
      );
      setSteps([]);
      return;
    }

    // 2. Reset + open drawer
    resetSimulator();
    openDrawer();
    setStatus('running');
    stepBufferRef.current = [];

    try {
      // 3. Build request using service (no manual transformation here)
      const request = buildSimulationRequest(meta.id, nodes, edges);

      // 4. Stream each step as it executes (service calls this callback)
      const onStep = (step: SimulationStep) => {
        // Replace any existing entry for this nodeId (running → completed)
        const idx = stepBufferRef.current.findIndex(
          (s) => s.nodeId === step.nodeId
        );
        if (idx !== -1) {
          stepBufferRef.current[idx] = step;
        } else {
          stepBufferRef.current.push(step);
        }
        // Shallow copy triggers re-render
        setSteps([...stepBufferRef.current]);
      };

      // 5. Execute simulation (all API interaction is here)
      const response = await runSimulation(request, onStep);

      // 6. Update UI with results (using service helper functions)
      setSteps(response.steps);
      setStatus(getSimulationStatus(response) as 'completed' | 'error');

      const errorMsg = getSimulationErrorMessage(response);
      if (errorMsg) {
        setError(errorMsg);
      }
    } catch (err) {
      setStatus('error');
      setError(
        err instanceof Error ? err.message : 'Unexpected error during simulation.'
      );
    }
  }, [
    nodes,
    edges,
    meta,
    validate,
    setStatus,
    setSteps,
    setError,
    openDrawer,
    resetSimulator,
  ]);

  return { run };
}
