import React from 'react';
import { Workflow } from 'lucide-react';

export const EmptyCanvas: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 text-gray-300">
        <Workflow className="h-8 w-8" />
      </div>
      <p className="text-sm font-semibold text-gray-400">Drag nodes here to start</p>
      <p className="mt-1 text-xs text-gray-300">
        Connect them to build your HR workflow
      </p>
    </div>
  </div>
);
