export const finishes = [
  { at: 0, name: 'Moonstone', shell: '#b9b6ad' },
  { at: 20, name: 'Terracotta', shell: '#ba705b' },
  { at: 40, name: 'Honey', shell: '#c6a35b' },
  { at: 60, name: 'Sage', shell: '#87a889' },
  { at: 80, name: 'Deep sea', shell: '#547e83' },
  { at: 100, name: 'Lilac', shell: '#a28abb' },
];

export function finishAt(position: number) {
  const value = Number.isFinite(position) ? Math.max(0, Math.min(100, position)) : 0;
  const upper = Math.max(
    1,
    finishes.findIndex((finish) => finish.at >= value),
  );
  const from = finishes[upper - 1]!;
  const to = finishes[upper]!;
  const amount = (value - from.at) / (to.at - from.at);
  const channels = [1, 3, 5].map((offset) => {
    const a = parseInt(from.shell.slice(offset, offset + 2), 16);
    const b = parseInt(to.shell.slice(offset, offset + 2), 16);
    return Math.round(a + (b - a) * amount)
      .toString(16)
      .padStart(2, '0');
  });
  const exact = finishes.find((finish) => finish.at === value);
  return { shell: '#' + channels.join(''), name: exact?.name ?? from.name + ' → ' + to.name };
}
