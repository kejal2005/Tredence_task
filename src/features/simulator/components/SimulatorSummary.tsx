import React from 'react';
import { CheckCircle2, XCircle, SkipForward, Timer, Hash } from 'lucide-react';
import type { SimulationStep } from '@types-app/api';
import { cn } from '@lib/cn';

interface SimulatorSummaryProps {
  steps:  SimulationStep[];
  status: string;
}

export const SimulatorSummary: React.FC<SimulatorSummaryProps> = ({ steps, status }) => {
  const succeeded = steps.filter((s) => s.status === 'success').length;
  const failed    = steps.filter((s) => s.status === 'error').length;
  const skipped   = steps.filter((s) => s.status === 'skipped').length;
  const totalMs   = steps.reduce((acc, s) => acc + s.durationMs, 0);

  const stats = [
    {
      icon:  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
      label: 'Passed',
      value: succeeded,
      color: 'text-emerald-700',
    },
    {
      icon:  <XCircle className="h-3.5 w-3.5 text-red-500" />,
      label: 'Failed',
      value: failed,
      color: 'text-red-700',
    },
    {
      icon:  <SkipForward className="h-3.5 w-3.5 text-gray-400" />,
      label: 'Skipped',
      value: skipped,
      color: 'text-gray-600',
    },
    {
      icon:  <Timer className="h-3.5 w-3.5 text-blue-500" />,
      label: 'Duration',
      value: `${totalMs}ms`,
      color: 'text-blue-700',
    },
    {
      icon:  <Hash className="h-3.5 w-3.5 text-violet-500" />,
      label: 'Steps',
      value: steps.length,
      color: 'text-violet-700',
    },
  ];

  return (
    <div className={cn(
      'rounded-xl border p-3',
      status === 'completed' ? 'border-emerald-200 bg-emerald-50' :
      status === 'error'     ? 'border-red-200 bg-red-50' :
                               'border-blue-200 bg-blue-50'
    )}>
      <p className={cn(
        'mb-2 text-xs font-bold',
        status === 'completed' ? 'text-emerald-800' :
        status === 'error'     ? 'text-red-800' :
                                 'text-blue-800'
      )}>
        {status === 'completed' ? '✓ Simulation Completed'  :
         status === 'error'     ? '✗ Simulation Failed'     :
                                  '⟳ Running…'}
      </p>

      <div className="grid grid-cols-5 gap-2">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="mb-0.5 flex justify-center">{stat.icon}</div>
            <p className={cn('text-sm font-bold', stat.color)}>{stat.value}</p>
            <p className="text-[9px] uppercase tracking-wide text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
