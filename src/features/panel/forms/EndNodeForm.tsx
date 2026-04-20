import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCanvasActions } from '@store/index';
import {
  FormField, TextInput, Toggle,
} from './FormPrimitives';
import { endNodeSchema, type EndNodeFormValues } from '@types-app/forms';
import type { EndNodeData } from '@types-app/nodes';

interface EndNodeFormProps {
  nodeId: string;
  data:   EndNodeData;
}

export const EndNodeForm: React.FC<EndNodeFormProps> = ({ nodeId, data }) => {
  const { updateNodeData } = useCanvasActions();
  const {
    register, handleSubmit, watch, setValue, formState: { errors },
  } = useForm<EndNodeFormValues>({
    resolver: zodResolver(endNodeSchema),
    defaultValues: {
      message:     data.message || '',
      showSummary: data.showSummary ?? true,
    },
  });

  const showSummary = watch('showSummary');

  const onSubmit = (values: EndNodeFormValues) => {
    updateNodeData(nodeId, values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <FormField
        label="Completion Message"
        error={errors.message?.message}
      >
        <TextInput
          {...register('message')}
          hasError={!!errors.message}
          placeholder="e.g., Onboarding process completed successfully!"
        />
      </FormField>

      <Toggle
        label="Show Summary"
        description="Display execution summary at end"
        checked={showSummary}
        onChange={(checked) => setValue('showSummary', checked)}
      />
    </form>
  );
};
