export type WalkthroughCommand = 'next' | 'back' | 'play' | 'stop';
export type WalkthroughState = {
  index: number;
  total: number;
  label: string;
  playing: boolean;
  message: string;
};
export function isWalkthroughCommand(value: unknown): value is WalkthroughCommand {
  return ['next', 'back', 'play', 'stop'].includes(value as string);
}
export function isWalkthroughState(value: unknown): value is WalkthroughState {
  if (!value || typeof value !== 'object') return false;
  const v = value as WalkthroughState;
  return (
    Number.isInteger(v.total) &&
    v.total > 0 &&
    v.total <= 20 &&
    Number.isInteger(v.index) &&
    v.index >= -1 &&
    v.index < v.total &&
    typeof v.label === 'string' &&
    v.label.length <= 200 &&
    typeof v.message === 'string' &&
    v.message.length <= 300 &&
    typeof v.playing === 'boolean'
  );
}

/** Owns one cancellable run. Demo effects receive its signal, never a gallery dependency. */
export function createWalkthrough(
  labels: readonly string[],
  apply: (index: number, signal: AbortSignal) => void | Promise<void>,
  stop: () => void,
  report: (state: WalkthroughState) => void,
) {
  let state: WalkthroughState = {
    index: -1,
    total: labels.length,
    label: 'Ready',
    playing: false,
    message: '',
  };
  let controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const publish = () => report({ ...state });
  function cancel() {
    controller.abort();
    clearTimeout(timer);
    state.playing = false;
  }
  async function run(index: number, playing: boolean) {
    cancel();
    controller = new AbortController();
    const { signal } = controller;
    state = { ...state, index, label: labels[index]!, playing, message: '' };
    publish();
    try {
      await apply(index, signal);
      if (signal.aborted || !playing) return;
      timer = setTimeout(() => {
        if (index + 1 < labels.length) void run(index + 1, true);
        else {
          cancel();
          stop();
          publish();
        }
      }, 5000);
    } catch (error) {
      if (signal.aborted) return;
      cancel();
      stop();
      state.message =
        error instanceof Error ? error.message.slice(0, 300) : 'Could not play this step.';
      publish();
    }
  }
  function command(action: WalkthroughCommand) {
    if (action === 'stop') {
      cancel();
      stop();
      publish();
      return;
    }
    if (action === 'play') {
      void run(state.index === labels.length - 1 ? 0 : Math.max(0, state.index), true);
      return;
    }
    const index = state.index + (action === 'next' ? 1 : -1);
    if (index >= 0 && index < labels.length) void run(index, false);
  }
  return {
    command,
    publish,
    interrupt() {
      cancel();
      publish();
    },
    dispose() {
      cancel();
      stop();
    },
  };
}
