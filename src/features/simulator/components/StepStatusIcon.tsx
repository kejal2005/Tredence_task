import React from 'react';
import { CheckCircle2, XCircle, SkipForward, Loader2, Clock } from 'lucide-react';
import type { StepStatus } from '@types-app/api';
import { cn } from '@lib/cn';

interface StepStatusIconProps {
  status:    StepStatus;
  className?: string;
}

export const StepStatusIcon: React.FC<StepStatusIconProps> = ({ status, className }) => {
  const base = cn('h-4 w-4 flex-shrink-0', className);

  switch (status) {
    case 'success':
      return <CheckCircle2 className={cn(base, 'text-emerald-500')} />;
    case 'error':
      return <XCircle className={cn(base, 'text-red-500')} />;
    case 'skipped':
      return <SkipForward className={cn(base, 'text-gray-400')} />;
    case 'running':
      return <Loader2 className={cn(base, 'animate-spin text-blue-500')} />;
    case 'pending':
    default:
      return <Clock className={cn(base, 'text-gray-300')} />;
  }
};

// ── Status badge pill ──────────────────────────────────────────────────────

interface StatusBadgeProps {
  status: StepStatus;
}

const STATUS_STYLES: Record<StepStatus, string> = {
  success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  error:   'bg-red-50 text-red-700 border border-red-200',
  skipped: 'bg-gray-50 text-gray-500 border border-gray-200',
  running: 'bg-blue-50 text-blue-700 border border-blue-200',
  pending: 'bg-gray-50 text-gray-400 border border-gray-100',
};

const STATUS_LABELS: Record<StepStatus, string> = {
  success: 'Success',
  error:   'Error',
  skipped: 'Skipped',
  running: 'Running',
  pending: 'Pending',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
      STATUS_STYLES[status]
    )}
  >
    {STATUS_LABELS[status]}
  </span>
);
