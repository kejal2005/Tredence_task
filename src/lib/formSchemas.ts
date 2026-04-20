/**
 * Unified Form Schema System
 *
 * Defines form structure for all node types in one place.
 * This enables:
 * - Dynamic form rendering (no if/switch statements)
 * - Easy extensibility (add node type = add schema entry)
 * - Type-safe field definitions
 *
 * Pattern: Each node's form schema maps field names to field definitions.
 * DynamicForm component reads this and renders the appropriate input.
 */

import { z } from 'zod';
import type { NodeType } from '@types-app/nodes';

// ─────────────────────────────────────────────
// Field Type Definitions
// ─────────────────────────────────────────────

export type FormFieldType = 'text' | 'textarea' | 'number' | 'date' | 'select' | 'checkbox' | 'keyvalue';

export interface FormFieldDefinition {
  type: FormFieldType;
  label: string;
  required?: boolean;
  placeholder?: string;
  description?: string;
  // For select fields
  options?: Array<{ value: string; label: string }>;
  // For number fields
  min?: number;
  max?: number;
  // For text fields
  maxLength?: number;
}

export interface FormSectionSchema {
  title?: string;
  description?: string;
  fields: Record<string, FormFieldDefinition>;
}

// ─────────────────────────────────────────────
// Zod Schema Definitions (for validation)
// ─────────────────────────────────────────────

const keyValuePairSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string(),
});

const startNodeFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(80),
  metadata: z.array(keyValuePairSchema),
});

const taskNodeFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(80),
  description: z.string().max(500).default(''),
  assignee: z.string().max(100).default(''),
  dueDate: z.string().default(''),
  customFields: z.array(keyValuePairSchema),
});

const approvalNodeFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(80),
  approverRole: z.string().min(1, 'Approver role is required'),
  autoApproveThreshold: z.coerce
    .number()
    .min(0, 'Min is 0')
    .max(100, 'Max is 100'),
});

const automatedNodeFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(80),
  actionId: z.string().min(1, 'Please select an action'),
  actionLabel: z.string(),
  parameters: z.record(z.string(), z.string()),
});

const endNodeFormSchema = z.object({
  message: z.string().max(300).default(''),
  showSummary: z.boolean(),
});

// ─────────────────────────────────────────────
// UI Schema Definitions (for DynamicForm)
// ─────────────────────────────────────────────

export const FORM_SCHEMAS: Record<NodeType, FormSectionSchema> = {
  start: {
    title: 'Start Node Configuration',
    fields: {
      title: {
        type: 'text',
        label: 'Workflow Title',
        required: true,
        placeholder: 'e.g., Leave Request',
        maxLength: 80,
      },
      metadata: {
        type: 'keyvalue',
        label: 'Metadata',
        description: 'Add any additional workflow metadata',
      },
    },
  },

  task: {
    title: 'Task Node Configuration',
    fields: {
      title: {
        type: 'text',
        label: 'Task Title',
        required: true,
        placeholder: 'e.g., Review Application',
        maxLength: 80,
      },
      description: {
        type: 'textarea',
        label: 'Description',
        placeholder: 'Add details about this task...',
        maxLength: 500,
      },
      assignee: {
        type: 'text',
        label: 'Assignee',
        placeholder: 'e.g., john.doe@company.com',
        maxLength: 100,
      },
      dueDate: {
        type: 'date',
        label: 'Due Date',
      },
      customFields: {
        type: 'keyvalue',
        label: 'Custom Fields',
        description: 'Add task-specific metadata',
      },
    },
  },

  approval: {
    title: 'Approval Node Configuration',
    fields: {
      title: {
        type: 'text',
        label: 'Approval Title',
        required: true,
        placeholder: 'e.g., Manager Approval',
        maxLength: 80,
      },
      approverRole: {
        type: 'text',
        label: 'Approver Role',
        required: true,
        placeholder: 'e.g., Hiring Manager, HR Lead',
      },
      autoApproveThreshold: {
        type: 'number',
        label: 'Auto-Approve Threshold (%)',
        min: 0,
        max: 100,
        placeholder: '0–100',
        description: 'Leave at 0 to require manual approval. Set above 0 to auto-approve if confidence exceeds threshold.',
      },
    },
  },

  automated: {
    title: 'Automated Action Configuration',
    fields: {
      title: {
        type: 'text',
        label: 'Action Title',
        required: true,
        placeholder: 'e.g., Send Email',
        maxLength: 80,
      },
      actionId: {
        type: 'select',
        label: 'Action Type',
        required: true,
        options: [
          { value: 'send_email', label: 'Send Email' },
          { value: 'send_slack', label: 'Send Slack Message' },
          { value: 'update_crm', label: 'Update CRM' },
          { value: 'create_ticket', label: 'Create Support Ticket' },
        ],
      },
      actionLabel: {
        type: 'text',
        label: 'Action Label',
        placeholder: 'Display name for this action',
      },
      parameters: {
        type: 'keyvalue',
        label: 'Parameters',
        description: 'Configure action-specific parameters',
      },
    },
  },

  end: {
    title: 'End Node Configuration',
    fields: {
      message: {
        type: 'textarea',
        label: 'Completion Message',
        placeholder: 'Message shown when workflow completes...',
        maxLength: 300,
      },
      showSummary: {
        type: 'checkbox',
        label: 'Show Summary',
        description: 'Display workflow execution summary',
      },
    },
  },
};

// ─────────────────────────────────────────────
// Export Zod Validators
// ─────────────────────────────────────────────

export const FORM_VALIDATORS: Record<NodeType, z.ZodType> = {
  start: startNodeFormSchema,
  task: taskNodeFormSchema,
  approval: approvalNodeFormSchema,
  automated: automatedNodeFormSchema,
  end: endNodeFormSchema,
};

/**
 * Get validator for a specific node type.
 * Used for form validation and type safety.
 */
export function getFormValidator(nodeType: NodeType) {
  return FORM_VALIDATORS[nodeType];
}

/**
 * Get UI schema for a specific node type.
 * Used for DynamicForm rendering.
 */
export function getFormSchema(nodeType: NodeType) {
  return FORM_SCHEMAS[nodeType];
}
