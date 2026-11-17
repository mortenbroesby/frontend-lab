/** Both views use the same live audio samples; no animation runs on a fake beat. */
export function paintSignal(
  context: CanvasRenderingContext2D,
  samples: Uint8Array,
  spectrum?: Uint8Array,
) {
  context.clearRect(0, 0, 1000, 240);
  const glow = context.createLinearGradient(0, 240, 0, 0);
  glow.addColorStop(0, '#9cf6b880');
  glow.addColorStop(1, '#9cf6b808');
  context.fillStyle = glow;
  for (let bar = 0; spectrum && bar < 64; bar++) {
    const bin = Math.floor(2 ** ((bar / 64) * 8)) - 1;
    const height = (spectrum[bin] / 255) * 190;
    context.fillRect(bar * 15.625 + 2, 240 - height, 11.625, height);
  }
  // Fit the presentation's quieter audio to the scope without amplifying silence.
  const peak = spectrum ? 128 : Math.max(8, ...samples.map((value) => Math.abs(value - 128)));
  context.strokeStyle = '#c6ffdc';
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(0, 120);
  samples.forEach((value, index) =>
    context.lineTo((index / 1023) * 1000, 120 + ((value - 128) / peak) * (spectrum ? 400 : 100)),
  );
  context.stroke();
}
