import { createFSM } from 'xstate/fsm';

export const playbackMachine = createFSM({
  initial: 'browsing',
  states: {
    browsing: { on: { Enter: { target: 'controls' } } },
    controls: {
      on: {
        Escape: { target: 'watching' },
        ArrowUp: { target: 'watching' },
      },
    },
    watching: {
      on: {
        Escape: { target: 'browsing' },
        ArrowDown: { target: 'controls' },
        Enter: { target: 'controls' },
      },
    },
  },
});
