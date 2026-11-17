# Pocket tracker

A small browser instrument inspired by tracker music. Press Play for an original loop, edit its 16 steps, then shape the sound with tempo, tone, echo and voice levels. Audio is synthesized with Web Audio; no recordings, services or hardware are required. Start/stop is explicit and leaving the app closes the audio context. Reduced motion replaces the oscilloscope with a static line.

From the repository root:

```sh
npm run dev --workspace @lab/demo-browser-instrument -- --host 0.0.0.0
```

`pattern.ts` holds the melody and default grid. `audio.ts` schedules notes against the audio clock; React controls settings and Canvas draws the waveform. Try changing the melody or oscillator types. Keep levels conservative when experimenting with sound.

The sequencer wraps into groups of eight steps, or four on phones, keeping every step visible without horizontal scrolling. Controls work with touch and keyboard; use arrow keys on a focused slider. Reset pattern restores the grid without changing the sound controls.

[Web Audio introduction](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API)
