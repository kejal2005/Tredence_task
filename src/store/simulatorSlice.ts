import type { StateCreator } from 'zustand';
import type { SimulatorState, SimulatorStatus } from '@types-app/store';
import type { SimulationStep } from '@types-app/api';
import type { RootStore } from './index';

export const createSimulatorSlice: StateCreator<
  RootStore,
  [['zustand/devtools', never], ['zustand/immer', never]],
  [],
  SimulatorState
> = (set) => ({
  status:       'idle',
  steps:        [],
  errorMessage: null,
  isDrawerOpen: false,

  setStatus: (status: SimulatorStatus) =>
    set(
      (state) => { state.status = status; },
      false,
      'simulator/setStatus'
    ),

  setSteps: (steps: SimulationStep[]) =>
    set(
      (state) => { state.steps = steps; },
      false,
      'simulator/setSteps'
    ),

  setError: (msg: string | null) =>
    set(
      (state) => { state.errorMessage = msg; },
      false,
      'simulator/setError'
    ),

  openDrawer: () =>
    set(
      (state) => { state.isDrawerOpen = true; },
      false,
      'simulator/openDrawer'
    ),

  closeDrawer: () =>
    set(
      (state) => { state.isDrawerOpen = false; },
      false,
      'simulator/closeDrawer'
    ),

  resetSimulator: () =>
    set(
      (state) => {
        state.status       = 'idle';
        state.steps        = [];
        state.errorMessage = null;
        state.isDrawerOpen = false;
      },
      false,
      'simulator/reset'
    ),
});
