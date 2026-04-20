import React from 'react';
import { cn } from '@lib/cn';

// ─────────────────────────────────────────────
// FormField wrapper (label + input + error)
// ─────────────────────────────────────────────
interface FormFieldProps {
  label:     string;
  error?:    string;
  required?: boolean;
  children:  React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label, error, required, children, className,
}) => (
  <div className={cn('space-y-1', className)}>
    <label className="form-label">
      {label}
      {required && <span className="ml-0.5 text-red-400">*</span>}
    </label>
    {children}
    {error && <p className="form-error">{error}</p>}
  </div>
);

// ─────────────────────────────────────────────
// TextInput
// ─────────────────────────────────────────────
interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ hasError, className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'form-input',
        hasError && 'border-red-400 focus:border-red-400 focus:ring-red-100',
        className
      )}
      {...props}
    />
  )
);
TextInput.displayName = 'TextInput';

// ─────────────────────────────────────────────
// Textarea
// ─────────────────────────────────────────────
interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ hasError, className, ...props }, ref) => (
    <textarea
      ref={ref}
      rows={3}
      className={cn(
        'form-input resize-none leading-relaxed',
        hasError && 'border-red-400 focus:border-red-400 focus:ring-red-100',
        className
      )}
      {...props}
    />
  )
);
TextArea.displayName = 'TextArea';

// ─────────────────────────────────────────────
// SelectInput
// ─────────────────────────────────────────────
interface SelectOption { value: string; label: string }

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options:   SelectOption[];
  hasError?: boolean;
  placeholder?: string;
}

export const SelectInput = React.forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ options, hasError, placeholder, className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'form-input cursor-pointer appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_0.5rem_center] pr-8',
        hasError && 'border-red-400 focus:border-red-400 focus:ring-red-100',
        className
      )}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>{placeholder}</option>
      )}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
);
SelectInput.displayName = 'SelectInput';

// ─────────────────────────────────────────────
// Toggle (checkbox styled as switch)
// ─────────────────────────────────────────────
interface ToggleProps {
  checked:  boolean;
  onChange: (checked: boolean) => void;
  label:    string;
  description?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked, onChange, label, description,
}) => (
  <label className="flex cursor-pointer items-start gap-3">
    <div className="relative mt-0.5 flex-shrink-0">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div
        className={cn(
          'h-5 w-9 rounded-full transition-colors duration-200',
          checked ? 'bg-blue-600' : 'bg-gray-200'
        )}
      />
      <div
        className={cn(
          'absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm',
          'transition-transform duration-200',
          checked ? 'translate-x-4' : 'translate-x-0'
        )}
      />
    </div>
    <div>
      <p className="text-xs font-semibold text-gray-700">{label}</p>
      {description && (
        <p className="text-xs text-gray-400">{description}</p>
      )}
    </div>
  </label>
);

// ─────────────────────────────────────────────
// NumberInput
// ─────────────────────────────────────────────
interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ hasError, className, ...props }, ref) => (
    <input
      ref={ref}
      type="number"
      className={cn(
        'form-input',
        hasError && 'border-red-400 focus:border-red-400 focus:ring-red-100',
        className
      )}
      {...props}
    />
  )
);
NumberInput.displayName = 'NumberInput';

// ─────────────────────────────────────────────
// SectionDivider
// ─────────────────────────────────────────────
export const SectionDivider: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-2 pt-1">
    <div className="h-px flex-1 bg-gray-100" />
    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
      {label}
    </span>
    <div className="h-px flex-1 bg-gray-100" />
  </div>
);
