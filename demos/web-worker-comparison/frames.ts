/** Observe callback gaps through the first frame after work finishes. */
export function observeFrames() {
  let previous = performance.now();
  let longest = 0;
  let hidden = document.hidden;
  let complete: ((gap: number | null) => void) | undefined;
  let disposed = false;
  let frame: number;

  function dispose() {
    disposed = true;
    cancelAnimationFrame(frame);
    document.removeEventListener('visibilitychange', visibility);
  }
  function publish() {
    const callback = complete;
    dispose();
    callback?.(hidden ? null : longest);
  }
  function visibility() {
    hidden ||= document.hidden;
    if (hidden && complete) publish();
  }
  function sample() {
    const now = performance.now();
    longest = Math.max(longest, now - previous);
    previous = now;
    if (complete) publish();
    else frame = requestAnimationFrame(sample);
  }
  document.addEventListener('visibilitychange', visibility);
  frame = requestAnimationFrame(sample);
  return {
    finish(callback: (gap: number | null) => void) {
      if (disposed) return;
      complete = callback;
      if (hidden) publish();
    },
    dispose,
  };
}
