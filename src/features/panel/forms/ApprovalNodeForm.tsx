import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCanvasActions } from '@store/index';
import {
  FormField, TextInput, NumberInput,
} from './FormPrimitives';
import { approvalNodeSchema, type ApprovalNodeFormValues } from '@types-app/forms';
import type { ApprovalNodeData } from '@types-app/nodes';

interface ApprovalNodeFormProps {
  nodeId: string;
  data:   ApprovalNodeData;
}

export const ApprovalNodeForm: React.FC<ApprovalNodeFormProps> = ({ nodeId, data }) => {
  const { updateNodeData } = useCanvasActions();
  const {
    register, handleSubmit, formState: { errors },
  } = useForm<ApprovalNodeFormValues>({
    resolver: zodResolver(approvalNodeSchema),
    defaultValues: {
      title:                data.title,
      approverRole:         data.approverRole || '',
      autoApproveThreshold: data.autoApproveThreshold || 0,
    },
  });

  const onSubmit = (values: ApprovalNodeFormValues) => {
    updateNodeData(nodeId, values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-4">
      <FormField
        label="Approval Title"
        error={errors.title?.message}
        required
      >
        <TextInput
          {...register('title')}
          hasError={!!errors.title}
          placeholder="e.g., Manager Approval"
        />
      </FormField>

      <FormField
        label="Approver Role"
        error={errors.approverRole?.message}
        required
      >
        <TextInput
          {...register('approverRole')}
          hasError={!!errors.approverRole}
          placeholder="e.g., Hiring Manager, HR Lead"
        />
      </FormField>

      <FormField
        label="Auto-Approve Threshold (%)"
        error={errors.autoApproveThreshold?.message}
      >
        <NumberInput
          {...register('autoApproveThreshold')}
          hasError={!!errors.autoApproveThreshold}
          min={0}
          max={100}
          placeholder="0–100"
        />
      </FormField>

      <p className="text-[11px] text-gray-500 leading-snug">
        Leave at 0 to require manual approval. Set above 0 to auto-approve if confidence score exceeds threshold.
      </p>
    </form>
  );
};
