import { useCallback, useMemo } from 'react';
import { useNodes, useEdges } from '@store/index';
import type { ValidationResult, ValidationIssue } from '@types-app/validation';
import { runValidationRules, VALIDATION_RULES } from '@services/validation/rules';

/**
 * REFACTORED: Now uses modular validation rules.
 *
 * BEFORE: 150+ lines of inline validation logic mixed with rule execution
 * AFTER: Delegates to rule modules, stays focused on hook concern (store integration)
 *
 * Benefits:
 * - Rules are independently testable
 * - Easy to add/remove rules via VALIDATION_RULES array
 * - Hook is cleaner and more maintainable
 * - Rules can be composed differently for different workflows
 */
export function useWorkflowValidator() {
  const nodes = useNodes();
  const edges = useEdges();

  // Rules can be customized per instance if needed
  const validationRules = useMemo(() => VALIDATION_RULES, []);

  const validate = useCallback((): ValidationResult => {
    // Run all registered validation rules
    const issues = runValidationRules(nodes, edges, validationRules);

    // Separate errors from warnings
    const errors = issues.filter((i: ValidationIssue) => i.severity === 'error');
    const warnings = issues.filter((i: ValidationIssue) => i.severity === 'warning');

    return {
      isValid: errors.length === 0,
      issues,
      errors,
      warnings,
      errorCount: errors.length,
      warningCount: warnings.length,
    };
  }, [nodes, edges, validationRules]);

  return { validate };
}
