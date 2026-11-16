import { countPrimes } from './compute';

self.onmessage = (event: MessageEvent<number>) => {
  try {
    const started = performance.now();
    const count = countPrimes(event.data);
    self.postMessage({ count, milliseconds: performance.now() - started });
  } catch (error) {
    self.postMessage({ error: error instanceof Error ? error.message : 'Computation failed.' });
  }
};
