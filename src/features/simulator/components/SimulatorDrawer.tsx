import React, { useEffect, useRef } from 'react';
import { X, Play, RotateCcw, Workflow } from 'lucide-react';
import { cn } from '@lib/cn';
import { Button } from '@components/ui/Button';
import { ExecutionStep }    from './ExecutionStep';
import { SimulatorSummary } from './SimulatorSummary';
import { ValidationErrors } from './ValidationErrors';
import { useSimulator }     from '../hooks/useSimulator';
import { useWorkflowValidator } from '@features/validator/hooks/useWorkflowValidator';
import {
  useSimulatorDrawer,
  useSimulatorStatus,
  useSimulatorSteps,
  useSimulatorError,
  useSimulatorActions,
} from '@store/index';

export const SimulatorDrawer: React.FC = () => {
  const isOpen  = useSimulatorDrawer();
  const status  = useSimulatorStatus();
  const steps   = useSimulatorSteps();
  const errMsg  = useSimulatorError();
  const { closeDrawer, resetSimulator } = useSimulatorActions();
  const { run } = useSimulator();
  const { validate } = useWorkflowValidator();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as steps stream in
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [steps.length]);

  // Pre-flight validation for display (non-blocking)
  const validation = validate();

  const isRunning   = status === 'running';
  const isIdle      = status === 'idle';
  const isDone      = status === 'completed' || status === 'error';

  const handleRun = () => {
    run();
  };

  const handleReset = () => {
    resetSimulator();
  };

  // Trap focus & close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isRunning) closeDrawer();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, isRunning, closeDrawer]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={() => !isRunning && closeDrawer()}
      />

      {/* Drawer panel */}
      <div
        className={cn(
          'fixed bottom-0 right-0 top-0 z-50 flex w-[480px] flex-col bg-white shadow-2xl',
          'transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* ── Header ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Workflow className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-gray-900">Workflow Simulator</h2>
            <p className="text-xs text-gray-400">
              {isRunning  ? 'Simulation in progress…'         :
               isDone     ? `${steps.length} steps executed`  :
                            'Ready to simulate'}
            </p>
          </div>
          <button
            onClick={closeDrawer}
            disabled={isRunning}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg text-gray-400',
              'transition-colors hover:bg-gray-100 hover:text-gray-700',
              'disabled:pointer-events-none disabled:opacity-30'
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto panel-scroll px-5 py-4 space-y-3"
        >
          {/* Pre-flight validation */}
          {isIdle && (
            <>
              <ValidationErrors issues={validation.issues} />

              {validation.isValid && validation.issues.length === 0 && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-xs font-semibold text-emerald-700">
                    ✓ Workflow is valid and ready to simulate.
                  </p>
                </div>
              )}

              {validation.isValid && validation.issues.length > 0 && (
                <ValidationErrors issues={validation.issues} />
              )}

              <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <p className="text-xs text-gray-500">
                  The simulator will execute each node in topological order,
                  streaming results in real-time. Automated nodes will use mock
                  execution logic with simulated latency.
                </p>
              </div>
            </>
          )}

          {/* Error state (validation failure) */}
          {status === 'error' && errMsg && steps.length === 0 && (
            <ValidationErrors
              issues={errMsg.split('\n').map((msg, i) => ({
                id:       String(i),
                severity: 'error' as const,
                code:     'MISSING_START_NODE' as const,
                message:  msg,
              }))}
            />
          )}

          {/* Summary bar — shown when running or done */}
          {(isRunning || isDone) && steps.length > 0 && (
            <SimulatorSummary steps={steps} status={status} />
          )}

          {/* Step-by-step log */}
          {steps.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">
                Execution Log
              </p>
              {steps.map((step, i) => (
                <ExecutionStep key={step.stepId} step={step} index={i} />
              ))}
            </div>
          )}

          {/* Running spinner when no steps yet */}
          {isRunning && steps.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                <p className="text-xs text-gray-400">Initialising simulation…</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer actions ────────────────────────────────────────────── */}
        <div className="border-t border-gray-100 px-5 py-4">
          <div className="flex gap-2">
            {(isIdle || isDone) && (
              <>
                {isDone && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    iconLeft={<RotateCcw className="h-3.5 w-3.5" />}
                    className="flex-1"
                  >
                    Reset
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleRun}
                  disabled={!validation.isValid}
                  iconLeft={<Play className="h-3.5 w-3.5" />}
                  className="flex-1"
                >
                  {isDone ? 'Re-run Simulation' : 'Run Simulation'}
                </Button>
              </>
            )}

            {isRunning && (
              <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 py-2.5">
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                <span className="text-xs font-semibold text-blue-700">
                  Simulating {steps.length} of {steps.filter(s => s.status !== 'running').length + steps.filter(s => s.status === 'running').length} steps…
                </span>
              </div>
            )}
          </div>

          {!validation.isValid && isIdle && (
            <p className="mt-2 text-center text-[11px] text-red-500">
              Fix validation errors above before running
            </p>
          )}
        </div>
      </div>
    </>
  );
};
