import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCanvasActions } from '@store/index';
import {
  FormField, TextInput, SectionDivider,
} from './FormPrimitives';
import { KeyValueEditor } from './KeyValueEditor';
import { startNodeSchema, type StartNodeFormValues } from '@types-app/forms';
import type { StartNodeData } from '@types-app/nodes';

interface StartNodeFormProps {
  nodeId: string;
  data:   StartNodeData;
}

export const StartNodeForm: React.FC<StartNodeFormProps> = ({ nodeId, data }) => {
  const { updateNodeData } = useCanvasActions();
  const {
    register, control, handleSubmit, formState: { errors },
  } = useForm<StartNodeFormValues>({
    resolver: zodResolver(startNodeSchema),
    defaultValues: {
      title:    data.title,
      metadata: data.metadata || [],
    },
  });

  const onSubmit = (values: StartNodeFormValues) => {
    updateNodeData(nodeId, values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <FormField
        label="Workflow Title"
        error={errors.title?.message}
        required
      >
        <TextInput
          {...register('title')}
          hasError={!!errors.title}
          placeholder="e.g., New Hire Onboarding"
        />
      </FormField>

      <SectionDivider label="Metadata" />

      <KeyValueEditor
        control={control}
        name="metadata"
        label="Metadata Fields"
        keyPlaceholder="e.g., priority"
        valuePlaceholder="e.g., high"
      />
    </form>
  );
};
