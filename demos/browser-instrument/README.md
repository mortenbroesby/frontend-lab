# Browser Beat

A small browser instrument inspired by keygen music and demoscene trackers. Choose one of three original loops with the previous/next buttons, press Play, edit its 16 steps, then shape the sound with tempo, tone, echo and voice levels. Audio is synthesized with Web Audio; no recordings, services or hardware are required. Start/stop is explicit and leaving the app closes the audio context. Reduced motion replaces the oscilloscope with a static line.

From the repository root:

```sh
npm run dev --workspace @lab/demo-browser-instrument -- --host 0.0.0.0
```

`pattern.ts` holds the three tunes: Midnight Circuit, Neon Coast and Moon Arcade. Each has a four-bar melody and chord progression; the 16-step grid repeats as a gate over each bar. Pulse leads, rapid three-note arpeggios, octave bass and synthesized noise drums evoke a cracktro soundtrack. Echo follows the tempo. The Pitch fader shifts melody and bass between five stops: −12, −7, 0, +7 and +12 semitones (octaves, fifths and the original pitch); drums and tempo stay unchanged. Switching tunes keeps the pitch, playback and sound controls unchanged, replacing any step edits with the selected tune’s grid. `audio.ts` schedules notes against the audio clock; React controls settings and Canvas draws the waveform. Try changing the melody or oscillator types or chord intervals. Keep levels conservative when experimenting with sound.

The sequencer wraps into groups of eight steps, or four on phones, keeping every step visible without horizontal scrolling. Controls work with touch and keyboard; use arrow keys on a focused slider. Reset pattern restores the selected tune’s grid without changing the sound controls.

[Web Audio introduction](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API)

## Performance view

Choose **Performance view** to open the instrument without the gallery's documentation shell. It uses a dark stage, live frequency spectrum, sound controls and step pads. **Fullscreen** expands it for a projector; Escape leaves fullscreen. Audio still starts only when you press Play, and leaving the page stops it.

The same standalone entry accepts `?embed=1`, like Canvas TV, for an iframe in the presentation. Use `allow="autoplay; fullscreen"` on the iframe when embedding and keep a way to continue the presentation outside it. The presentation embeds it on the instrument slide with `?embed=1&presentation=1`; the additional parameter hides the standalone return link. The deck fits a 1280 × 720 control surface into the slide, showing Play/Stop, four stacked Tempo/Pitch/Tone/Echo faders and a live waveform. Drag the raised fader handles left or right or focus them and use arrow keys (Home/End reach the limits). The sequencer and voice controls remain available in the standalone demo. On a phone, landscape gives the controls more room. The regular demo and standalone performance view still reflow for touch.
