import React, { Suspense, lazy } from 'react';
import { ReactFlowProvider } from '@xyflow/react';

import { ErrorBoundary }      from '@components/ErrorBoundary';
import { Toolbar }        from '@features/toolbar/components/Toolbar';
import { NodePalette }    from '@features/sidebar/components/NodePalette';
import { WorkflowCanvas } from '@features/canvas/components/WorkflowCanvas';
import { ConfigPanel }    from '@features/panel/components/ConfigPanel';

// Lazy-load heavy panels — not needed on first paint
const SimulatorDrawer = lazy(
  () => import('@features/simulator/components/SimulatorDrawer')
    .then((m) => ({ default: m.SimulatorDrawer }))
);
const ShortcutCheatsheet = lazy(
  () => import('@features/toolbar/components/ShortcutCheatsheet')
    .then((m) => ({ default: m.ShortcutCheatsheet }))
);

// Lightweight fallback — never flashes for >16ms loads
const DrawerFallback: React.FC = () => null;

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ReactFlowProvider>
        <div className="flex h-screen flex-col overflow-hidden bg-slate-50">
          <Toolbar />
          <div className="flex flex-1 overflow-hidden">
            <NodePalette />
            <main className="relative flex-1 overflow-hidden">
              <WorkflowCanvas />
            </main>
            <ConfigPanel />
          </div>
        </div>

        <Suspense fallback={<DrawerFallback />}>
          <SimulatorDrawer />
          <ShortcutCheatsheet />
        </Suspense>
      </ReactFlowProvider>
    </ErrorBoundary>
  );
};

export default App;
