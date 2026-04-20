// ─────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────

export type ValidationSeverity = 'error' | 'warning';

export interface ValidationIssue {
  id:        string;          // unique issue ID
  nodeId?:   string;          // if scoped to a node
  severity:  ValidationSeverity;
  code:      ValidationCode;
  message:   string;
}

export type ValidationCode =
  | 'MISSING_START_NODE'
  | 'MISSING_END_NODE'
  | 'DISCONNECTED_NODE'
  | 'MULTIPLE_START_NODES'
  | 'CYCLE_DETECTED'
  | 'MISSING_REQUIRED_FIELD'
  | 'DANGLING_EDGE';

export interface ValidationResult {
  isValid: boolean;
  issues:  ValidationIssue[];
  errors:  ValidationIssue[];    // severity === 'error'
  warnings: ValidationIssue[];   // severity === 'warning'
}
