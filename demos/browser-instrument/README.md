# Browser Beat

A small browser instrument inspired by tracker music. Press Play for an original loop, edit its 16 steps, then shape the sound with tempo, tone, echo and voice levels. Audio is synthesized with Web Audio; no recordings, services or hardware are required. Start/stop is explicit and leaving the app closes the audio context. Reduced motion replaces the oscilloscope with a static line.

From the repository root:

```sh
npm run dev --workspace @lab/demo-browser-instrument -- --host 0.0.0.0
```

`pattern.ts` holds the melody and default grid. `audio.ts` schedules notes against the audio clock; React controls settings and Canvas draws the waveform. Try changing the melody or oscillator types. Keep levels conservative when experimenting with sound.

The sequencer wraps into groups of eight steps, or four on phones, keeping every step visible without horizontal scrolling. Controls work with touch and keyboard; use arrow keys on a focused slider. Reset pattern restores the grid without changing the sound controls.

[Web Audio introduction](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API)

## Performance view

Choose **Performance view** to open the instrument without the gallery's documentation shell. It uses a dark stage, live frequency spectrum, sound controls and step pads. **Fullscreen** expands it for a projector; Escape leaves fullscreen. Audio still starts only when you press Play, and leaving the page stops it.

The same standalone entry accepts `?embed=1`, like Canvas TV, for an iframe in the presentation. Use `allow="autoplay; fullscreen"` on the iframe when embedding and keep a way to continue the presentation outside it. The presentation embeds it on the instrument slide with `?embed=1&presentation=1`; the additional parameter hides the standalone return link. The deck fits a 1280 × 720 control surface into the slide, showing only Play/Stop, Tempo, Tone, Echo and a subtle waveform. The sequencer and voice controls remain available in the standalone demo. On a phone, landscape gives the controls more room. The regular demo and standalone performance view still reflow for touch.
