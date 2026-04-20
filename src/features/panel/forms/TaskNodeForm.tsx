import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCanvasActions } from '@store/index';
import {
  FormField, TextInput, TextArea, NumberInput, SectionDivider,
} from './FormPrimitives';
import { KeyValueEditor } from './KeyValueEditor';
import { taskNodeSchema, type TaskNodeFormValues } from '@types-app/forms';
import type { TaskNodeData } from '@types-app/nodes';

interface TaskNodeFormProps {
  nodeId: string;
  data:   TaskNodeData;
}

export const TaskNodeForm: React.FC<TaskNodeFormProps> = ({ nodeId, data }) => {
  const { updateNodeData } = useCanvasActions();
  const {
    register, control, handleSubmit, formState: { errors },
  } = useForm<TaskNodeFormValues>({
    resolver: zodResolver(taskNodeSchema),
    defaultValues: {
      title:        data.title,
      description:  data.description || '',
      assignee:     data.assignee || '',
      dueDate:      data.dueDate || '',
      customFields: data.customFields || [],
    },
  });

  const onSubmit = (values: TaskNodeFormValues) => {
    updateNodeData(nodeId, values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-4">
      <FormField
        label="Task Title"
        error={errors.title?.message}
        required
      >
        <TextInput
          {...register('title')}
          hasError={!!errors.title}
          placeholder="e.g., Review Application"
        />
      </FormField>

      <FormField
        label="Description"
        error={errors.description?.message}
      >
        <TextArea
          {...register('description')}
          hasError={!!errors.description}
          placeholder="Add details about this task..."
        />
      </FormField>

      <FormField
        label="Assignee"
        error={errors.assignee?.message}
      >
        <TextInput
          {...register('assignee')}
          hasError={!!errors.assignee}
          placeholder="e.g., john.doe@company.com"
        />
      </FormField>

      <FormField
        label="Due Date"
        error={errors.dueDate?.message}
      >
        <TextInput
          {...register('dueDate')}
          hasError={!!errors.dueDate}
          type="date"
        />
      </FormField>

      <SectionDivider label="Custom Fields" />

      <KeyValueEditor
        control={control}
        name="customFields"
        label="Additional Fields"
        keyPlaceholder="Field name"
        valuePlaceholder="Field value"
      />
    </form>
  );
};
