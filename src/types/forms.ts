import { z } from 'zod';

export const keyValuePairSchema = z.object({
  key:   z.string().min(1, 'Key is required'),
  value: z.string(),
});

// ── Start ─────────────────────────────────────
export const startNodeSchema = z.object({
  title:    z.string().min(1, 'Title is required').max(80),
  metadata: z.array(keyValuePairSchema),
});
export type StartNodeFormValues = z.infer<typeof startNodeSchema>;

// ── Task ──────────────────────────────────────
export const taskNodeSchema = z.object({
  title:        z.string().min(1, 'Title is required').max(80),
  description:  z.string().max(500).default(''),
  assignee:     z.string().max(100).default(''),
  dueDate:      z.string().default(''),
  customFields: z.array(keyValuePairSchema),
});
export type TaskNodeFormValues = z.infer<typeof taskNodeSchema>;

// ── Approval ──────────────────────────────────
export const approvalNodeSchema = z.object({
  title:                z.string().min(1, 'Title is required').max(80),
  approverRole:         z.string().min(1, 'Approver role is required'),
  autoApproveThreshold: z.coerce
    .number()
    .min(0, 'Min is 0')
    .max(100, 'Max is 100'),
});
export type ApprovalNodeFormValues = z.infer<typeof approvalNodeSchema>;

// ── Automated ─────────────────────────────────
export const automatedNodeSchema = z.object({
  title:       z.string().min(1, 'Title is required').max(80),
  actionId:    z.string().min(1, 'Please select an action'),
  actionLabel: z.string(),
  parameters:  z.record(z.string(), z.string()),
});
export type AutomatedNodeFormValues = z.infer<typeof automatedNodeSchema>;

// ── End ───────────────────────────────────────
export const endNodeSchema = z.object({
  message:     z.string().max(300).default(''),
  showSummary: z.boolean(),
});
export type EndNodeFormValues = z.infer<typeof endNodeSchema>;

export type AnyNodeFormValues =
  | StartNodeFormValues
  | TaskNodeFormValues
  | ApprovalNodeFormValues
  | AutomatedNodeFormValues
  | EndNodeFormValues;
