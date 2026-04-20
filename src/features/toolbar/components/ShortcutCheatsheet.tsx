import React, { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';
import { cn } from '@lib/cn';
import { useUIStore } from '@store/uiStore';

interface ShortcutRowProps {
  keys:        string[];
  description: string;
}

const ShortcutRow: React.FC<ShortcutRowProps> = ({ keys, description }) => (
  <div className="flex items-center justify-between py-1.5">
    <span className="text-xs text-gray-600">{description}</span>
    <div className="flex items-center gap-1">
      {keys.map((key, i) => (
        <React.Fragment key={key}>
          {i > 0 && <span className="text-[10px] text-gray-400">+</span>}
          <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded
                          border border-gray-300 bg-gray-50 px-1.5 font-mono text-[10px]
                          font-semibold text-gray-700 shadow-sm">
            {key}
          </kbd>
        </React.Fragment>
      ))}
    </div>
  </div>
);

interface ShortcutGroup {
  title:     string;
  shortcuts: ShortcutRowProps[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'Canvas',
    shortcuts: [
      { keys: ['Del'],            description: 'Delete selected node' },
      { keys: ['Ctrl', 'Z'],     description: 'Undo' },
      { keys: ['Ctrl', 'Y'],     description: 'Redo' },
      { keys: ['Ctrl', 'Shift', 'F'], description: 'Fit view' },
      { keys: ['Scroll'],        description: 'Zoom in / out' },
      { keys: ['Space', 'Drag'], description: 'Pan canvas' },
    ],
  },
  {
    title: 'Nodes',
    shortcuts: [
      { keys: ['Drag'],   description: 'Move node' },
      { keys: ['Click'],  description: 'Select & configure node' },
      { keys: ['Shift', 'Click'], description: 'Multi-select nodes' },
      { keys: ['Esc'],    description: 'Deselect / close panel' },
    ],
  },
  {
    title: 'Workflow',
    shortcuts: [
      { keys: ['Ctrl', 'E'],    description: 'Export workflow JSON' },
      { keys: ['Ctrl', 'I'],    description: 'Import workflow JSON' },
      { keys: ['Ctrl', 'Enter'], description: 'Run simulation' },
      { keys: ['?'],            description: 'Toggle this cheatsheet' },
    ],
  },
];

export const ShortcutCheatsheet: React.FC = () => {
  const { isShortcutOpen, closeShortcuts } = useUIStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      if (e.key === 'Escape') closeShortcuts();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeShortcuts]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-200',
          isShortcutOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={closeShortcuts}
      />

      {/* Modal */}
      <div
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-[420px] -translate-x-1/2 -translate-y-1/2',
          'rounded-2xl border border-gray-200 bg-white shadow-2xl',
          'transition-all duration-200',
          isShortcutOpen
            ? 'scale-100 opacity-100'
            : 'pointer-events-none scale-95 opacity-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white">
            <Keyboard className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-bold text-gray-900">Keyboard Shortcuts</h2>
            <p className="text-xs text-gray-400">Press <kbd className="rounded border border-gray-200 bg-gray-50 px-1 font-mono text-[10px]">?</kbd> to toggle</p>
          </div>
          <button
            onClick={closeShortcuts}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400
                       transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Groups */}
        <div className="divide-y divide-gray-50 px-5 py-2">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title} className="py-3">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {group.title}
              </p>
              {group.shortcuts.map((s) => (
                <ShortcutRow key={s.description} {...s} />
              ))}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-50 px-5 py-3">
          <p className="text-center text-[10px] text-gray-400">
            Hold <kbd className="rounded border border-gray-200 bg-gray-50 px-1 font-mono">Shift</kbd> and drag to select multiple nodes
          </p>
        </div>
      </div>
    </>
  );
};
