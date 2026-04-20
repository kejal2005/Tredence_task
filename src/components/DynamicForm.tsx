/**
 * DynamicForm Component
 *
 * Renders forms from schema definitions. Eliminates the need for separate
 * form components per node type (TaskNodeForm, ApprovalNodeForm, etc.).
 *
 * BEFORE: ConfigPanel has 5 if statements → imports 5 form components
 * AFTER: ConfigPanel imports DynamicForm → renders based on schema
 *
 * Benefits:
 * - Adding a new node type = add schema entry only
 * - No component code changes needed
 * - Reduced code duplication
 * - Centralized form validation
 */

import React, { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FieldValues, SubmitHandler } from 'react-hook-form';
import {
  FormField,
  TextInput,
  TextArea,
  NumberInput,
  SelectInput,
  Toggle,
  SectionDivider,
} from '@features/panel/forms/FormPrimitives';
import { KeyValueEditor } from '@features/panel/forms/KeyValueEditor';
import { getFormSchema, getFormValidator, FormSectionSchema } from '@lib/formSchemas';
import type { NodeType } from '@types-app/nodes';

interface DynamicFormProps {
  nodeType: NodeType;
  defaultValues: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void;
}

/**
 * DynamicForm - Renders form fields based on schema
 *
 * Handles:
 * - Text, textarea, number, date, select, checkbox inputs
 * - KeyValue field arrays
 * - Zod validation
 * - Error display
 */
export const DynamicForm: React.FC<DynamicFormProps> = ({
  nodeType,
  defaultValues,
  onSubmit,
}) => {
  const schema = useMemo(() => getFormSchema(nodeType), [nodeType]);
  const validator = useMemo(() => getFormValidator(nodeType), [nodeType]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(validator),
    defaultValues,
  });

  const handleFormSubmit: SubmitHandler<FieldValues> = (values) => {
    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-3 p-4"
    >
      {schema.title && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700">{schema.title}</h3>
          {schema.description && (
            <p className="mt-1 text-xs text-gray-400">{schema.description}</p>
          )}
        </div>
      )}

      {renderFormFields(
        schema,
        register,
        control,
        errors
      )}
    </form>
  );
};

/**
 * renderFormFields - Renders all fields from schema
 */
function renderFormFields(
  schema: FormSectionSchema,
  register: any,
  control: any,
  errors: Record<string, any>
) {
  return Object.entries(schema.fields).map(([fieldName, fieldDef]) => {
    const error = errors[fieldName];

    switch (fieldDef.type) {
      case 'text':
        return (
          <FormField
            key={fieldName}
            label={fieldDef.label}
            error={error?.message}
            required={fieldDef.required}
          >
            <TextInput
              {...register(fieldName)}
              hasError={!!error}
              placeholder={fieldDef.placeholder}
              maxLength={fieldDef.maxLength}
            />
          </FormField>
        );

      case 'textarea':
        return (
          <FormField
            key={fieldName}
            label={fieldDef.label}
            error={error?.message}
            required={fieldDef.required}
          >
            <TextArea
              {...register(fieldName)}
              hasError={!!error}
              placeholder={fieldDef.placeholder}
              maxLength={fieldDef.maxLength}
            />
          </FormField>
        );

      case 'number':
        return (
          <FormField
            key={fieldName}
            label={fieldDef.label}
            error={error?.message}
            required={fieldDef.required}
          >
            <NumberInput
              {...register(fieldName)}
              hasError={!!error}
              placeholder={fieldDef.placeholder}
              min={fieldDef.min}
              max={fieldDef.max}
            />
          </FormField>
        );

      case 'date':
        return (
          <FormField
            key={fieldName}
            label={fieldDef.label}
            error={error?.message}
            required={fieldDef.required}
          >
            <TextInput
              {...register(fieldName)}
              hasError={!!error}
              type="date"
            />
          </FormField>
        );

      case 'select':
        return (
          <FormField
            key={fieldName}
            label={fieldDef.label}
            error={error?.message}
            required={fieldDef.required}
          >
            <SelectInput
              {...register(fieldName)}
              hasError={!!error}
              options={fieldDef.options || []}
              placeholder={fieldDef.placeholder}
            />
          </FormField>
        );

      case 'checkbox':
        return (
          <Controller
            key={fieldName}
            name={fieldName}
            control={control}
            render={({ field }) => (
              <Toggle
                checked={field.value as boolean}
                onChange={field.onChange}
                label={fieldDef.label}
                description={fieldDef.description}
              />
            )}
          />
        );

      case 'keyvalue':
        return (
          <div key={fieldName}>
            {fieldDef.label && (
              <SectionDivider label={fieldDef.label} />
            )}
            {fieldDef.description && (
              <p className="mb-3 text-xs text-gray-500">{fieldDef.description}</p>
            )}
            <KeyValueEditor
              control={control}
              name={fieldName}
              keyPlaceholder="Key"
              valuePlaceholder="Value"
            />
          </div>
        );

      default:
        return null;
    }
  });
}

export default DynamicForm;
