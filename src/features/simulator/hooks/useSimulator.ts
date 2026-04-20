import { useCallback, useRef } from 'react';
import {
  useNodes,
  useEdges,
  useWorkflowMeta,
  useSimulatorActions,
} from '@store/index';
import { simulateWorkflow } from '@api/simulation';
import { useWorkflowValidator } from '@features/validator/hooks/useWorkflowValidator';
import type { SimulationStep } from '@types-app/api';
import type { SimulateRequest } from '@types-app/api';

export function useSimulator() {
  const nodes   = useNodes();
  const edges   = useEdges();
  const meta    = useWorkflowMeta();

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

    // 3. Build request payload
    const request: SimulateRequest = {
      workflowId: meta.id,
      nodes: nodes.map((n) => ({
        id:       n.id,
        type:     n.type ?? 'unknown',
        data:     n.data as Record<string, unknown>,
        position: n.position,
      })),
      edges: edges.map((e) => ({
        id:     e.id,
        source: e.source,
        target: e.target,
      })),
    };

    try {
      // 4. Stream each step as it executes
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
        // Write a shallow copy to trigger re-render
        setSteps([...stepBufferRef.current]);
      };

      const response = await simulateWorkflow(request, onStep);

      setSteps(response.steps);
      setStatus(response.status === 'completed' ? 'completed' : 'error');
      if (response.status === 'failed') {
        setError('One or more steps failed during execution. See log below.');
      }
    } catch (err) {
      setStatus('error');
      setError(
        err instanceof Error ? err.message : 'Unexpected error during simulation.'
      );
    }
  }, [
    nodes, edges, meta,
    validate,
    setStatus, setSteps, setError, openDrawer, resetSimulator,
  ]);

  return { run };
}
