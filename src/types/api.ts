// ─────────────────────────────────────────────
// GET /automations
// ─────────────────────────────────────────────

export interface AutomationParameter {
  key:         string;
  label:       string;
  type:        'text' | 'number' | 'select' | 'boolean';
  required:    boolean;
  options?:    string[];          // for type === 'select'
  placeholder?: string;
  defaultValue?: string;
}

export interface AutomationAction {
  id:          string;
  label:       string;
  description: string;
  category:    string;
  parameters:  AutomationParameter[];
}

export interface GetAutomationsResponse {
  actions: AutomationAction[];
}

// ─────────────────────────────────────────────
// POST /simulate
// ─────────────────────────────────────────────

export type StepStatus = 'pending' | 'running' | 'success' | 'error' | 'skipped';

export interface SimulationStep {
  stepId:    string;
  nodeId:    string;
  nodeType:  string;
  label:     string;
  status:    StepStatus;
  message:   string;
  durationMs: number;
  output?:   Record<string, unknown>;
}

export interface SimulateRequest {
  workflowId: string;
  nodes: Array<{
    id:       string;
    type:     string;
    data:     Record<string, unknown>;
    position: { x: number; y: number };
  }>;
  edges: Array<{
    id:     string;
    source: string;
    target: string;
  }>;
}

export interface SimulateResponse {
  simulationId: string;
  status:       'completed' | 'failed';
  totalSteps:   number;
  steps:        SimulationStep[];
  executedAt:   string;
}
