import React from 'react';
import { useFieldArray, type Control, type FieldValues, type ArrayPath } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@lib/cn';

interface KeyValueEditorProps<T extends FieldValues> {
  control:   Control<T>;
  name:      ArrayPath<T>;
  label?:    string;
  keyPlaceholder?:   string;
  valuePlaceholder?: string;
}

export function KeyValueEditor<T extends FieldValues>({
  control,
  name,
  label = 'Fields',
  keyPlaceholder   = 'Key',
  valuePlaceholder = 'Value',
}: KeyValueEditorProps<T>) {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <span className="form-label">{label}</span>
          <button
            type="button"
            onClick={() => append({ key: '', value: '' } as never)}
            className={cn(
              'flex items-center gap-1 rounded-lg border border-dashed border-blue-300',
              'px-2 py-0.5 text-[10px] font-semibold text-blue-500',
              'transition-colors hover:border-blue-400 hover:bg-blue-50'
            )}
          >
            <Plus className="h-2.5 w-2.5" />
            Add
          </button>
        </div>
      )}

      {fields.length === 0 && (
        <p className="rounded-lg border border-dashed border-gray-200 py-3 text-center text-xs text-gray-400">
          No fields yet — click Add
        </p>
      )}

      <div className="space-y-1.5">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-1.5">
            <input
              {...(control.register(`${name}.${index}.key` as never))}
              placeholder={keyPlaceholder}
              className="form-input flex-1 text-xs"
            />
            <input
              {...(control.register(`${name}.${index}.value` as never))}
              placeholder={valuePlaceholder}
              className="form-input flex-1 text-xs"
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className={cn(
                'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg',
                'text-gray-300 transition-colors hover:bg-red-50 hover:text-red-400'
              )}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
