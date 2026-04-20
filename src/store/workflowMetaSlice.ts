import type { StateCreator } from 'zustand';
import type { WorkflowMetaState, WorkflowMeta } from '@types-app/store';
import type { RootStore } from './index';
import { generateId } from '@lib/id';

export const createWorkflowMetaSlice: StateCreator<
  RootStore,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  WorkflowMetaState
> = (set) => ({
  meta: {
    id:          generateId('workflow'),
    name:        'Untitled Workflow',
    description: '',
  },

  setMeta: (partial: Partial<WorkflowMeta>) =>
    set(
      (state) => {
        state.meta = { ...state.meta, ...partial };
      },
      false,
      'meta/setMeta'
    ),
});
