import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import type { ValidationIssue } from '@types-app/validation';
import { cn } from '@lib/cn';

interface ValidationErrorsProps {
  issues: ValidationIssue[];
}

export const ValidationErrors: React.FC<ValidationErrorsProps> = ({ issues }) => {
  if (issues.length === 0) return null;

  const errors   = issues.filter((i) => i.severity === 'error');
  const warnings = issues.filter((i) => i.severity === 'warning');

  return (
    <div className="space-y-2">
      {errors.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-red-500" />
            <p className="text-xs font-bold text-red-700">
              {errors.length} Error{errors.length > 1 ? 's' : ''} — Cannot simulate
            </p>
          </div>
          <ul className="space-y-1">
            {errors.map((e) => (
              <li key={e.id} className="flex items-start gap-1.5">
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                <p className="text-[11px] text-red-700">{e.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
          <div className="mb-2 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            <p className="text-xs font-bold text-amber-700">
              {warnings.length} Warning{warnings.length > 1 ? 's' : ''}
            </p>
          </div>
          <ul className="space-y-1">
            {warnings.map((w) => (
              <li key={w.id} className="flex items-start gap-1.5">
                <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                <p className="text-[11px] text-amber-700">{w.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
