import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCanvasActions } from '@store/index';
import {
  FormField, TextInput, SelectInput, SectionDivider,
} from './FormPrimitives';
import { automatedNodeSchema, type AutomatedNodeFormValues } from '@types-app/forms';
import type { AutomatedNodeData } from '@types-app/nodes';
import type { AutomationAction } from '@types-app/api';
import { automationsApi } from '@api/automations';

interface AutomatedNodeFormProps {
  nodeId: string;
  data:   AutomatedNodeData;
}

export const AutomatedNodeForm: React.FC<AutomatedNodeFormProps> = ({ nodeId, data }) => {
  const { updateNodeData } = useCanvasActions();
  const [actions, setActions] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<AutomationAction | null>(null);

  const {
    register, handleSubmit, watch, formState: { errors }, setValue,
  } = useForm<AutomatedNodeFormValues>({
    resolver: zodResolver(automatedNodeSchema),
    defaultValues: {
      title:       data.title,
      actionId:    data.actionId || '',
      actionLabel: data.actionLabel || '',
      parameters:  data.parameters || {},
    },
  });

  const actionId = watch('actionId');

  // Load actions on mount
  useEffect(() => {
    automationsApi.getAutomations().then((res) => {
      setActions(res.actions);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Update selected action and parameters when actionId changes
  useEffect(() => {
    const action = actions.find((a) => a.id === actionId);
    setSelectedAction(action || null);
    if (action) {
      setValue('actionLabel', action.label);
      // Initialize parameters object
      const params: Record<string, string> = {};
      for (const param of action.parameters) {
        params[param.key] = data.parameters?.[param.key] || param.defaultValue || '';
      }
      setValue('parameters', params);
    }
  }, [actionId, actions, setValue, data.parameters]);

  const onSubmit = (values: AutomatedNodeFormValues) => {
    updateNodeData(nodeId, values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 p-4">
      <FormField
        label="Node Title"
        error={errors.title?.message}
        required
      >
        <TextInput
          {...register('title')}
          hasError={!!errors.title}
          placeholder="e.g., Send Welcome Email"
        />
      </FormField>

      <FormField
        label="Automation Action"
        error={errors.actionId?.message}
        required
      >
        <SelectInput
          {...register('actionId')}
          hasError={!!errors.actionId}
          options={actions.map((a) => ({ value: a.id, label: a.label }))}
          placeholder={loading ? 'Loading...' : 'Select an action'}
          disabled={loading}
        />
      </FormField>

      {selectedAction && (
        <>
          <p className="text-xs text-gray-500">{selectedAction.description}</p>

          <SectionDivider label="Parameters" />

          {selectedAction.parameters.length === 0 ? (
            <p className="text-xs text-gray-400">No parameters required</p>
          ) : (
            <div className="space-y-2">
              {selectedAction.parameters.map((param) => (
                <FormField
                  key={param.key}
                  label={param.label}
                  required={param.required}
                >
                  {param.type === 'select' ? (
                    <SelectInput
                      {...register(`parameters.${param.key}`)}
                      options={
                        param.options?.map((o) => ({
                          value: o,
                          label: o,
                        })) || []
                      }
                      placeholder={param.placeholder || `Select ${param.label}`}
                    />
                  ) : param.type === 'number' ? (
                    <TextInput
                      {...register(`parameters.${param.key}`)}
                      type="number"
                      placeholder={param.placeholder || ''}
                    />
                  ) : (
                    <TextInput
                      {...register(`parameters.${param.key}`)}
                      placeholder={param.placeholder || ''}
                    />
                  )}
                </FormField>
              ))}
            </div>
          )}
        </>
      )}
    </form>
  );
};
