export type Action =
  | 'bun'
  | 'cake'
  | 'cup'
  | 'develop'
  | 'stop'
  | 'fix'
  | 'insert'
  | 'horizontal'
  | 'vertical'
  | 'project'
  | 'breakfast'
  | 'darkroom'
  | 'attic'
  | 'readnote'
  | 'readrecipe'
  | 'takeplate';
export type Game = ReturnType<typeof initialState>;
export function initialState() {
  return {
    room: 0,
    sequence: [] as string[],
    breakfast: false,
    bath: 0,
    plate: false,
    negative: false,
    note: false,
    recipe: false,
    inserted: false,
    horizontal: 0,
    vertical: 0,
    revealed: false,
  };
}
function breakfast(s: Game, action: Action): Game {
  const order = ['bun', 'cake', 'cup'];
  if (s.breakfast || !order.includes(action)) return s;
  const sequence = action === order[s.sequence.length] ? [...s.sequence, action] : [];
  return { ...s, sequence, breakfast: sequence.length === 3 };
}
function darkroom(s: Game, action: Action): Game {
  if (action === 'takeplate') return { ...s, negative: true };
  const order = ['develop', 'stop', 'fix'];
  if (s.plate || !s.negative || !order.includes(action)) return s;
  const bath = action === order[s.bath] ? s.bath + 1 : 0;
  return { ...s, bath, plate: bath === 3 };
}
function attic(s: Game, action: Action): Game {
  if (action === 'insert' && s.plate) return { ...s, inserted: true };
  if (action === 'horizontal') return { ...s, horizontal: (s.horizontal + 1) % 4 };
  if (action === 'vertical') return { ...s, vertical: (s.vertical + 1) % 4 };
  if (action === 'project' && s.inserted && s.horizontal === 1 && s.vertical === 2)
    return { ...s, revealed: true };
  return s;
}
export function act(s: Game, action: Action): Game {
  if (action === 'readnote') return { ...s, note: true };
  if (action === 'readrecipe') return { ...s, recipe: true };
  if (action === 'breakfast') return { ...s, room: 0 };
  if (action === 'darkroom' && s.breakfast) return { ...s, room: 1 };
  if (action === 'attic' && s.plate) return { ...s, room: 2 };
  return [breakfast, darkroom, attic][s.room]!(s, action);
}
export function hint(s: Game, level = 0) {
  const clues = !s.breakfast
    ? [
        'There is a sealed invitation beside the flowers. Someone has left you a little ritual.',
        'What rises before dawn? What is served with a wish? What chases sleep away?',
        'Touch the brass seals beneath the buns, then the cake, then the coffee cup.',
      ]
    : !s.negative
      ? [
          'The photographer has left a camera ready for one last exposure.',
          'Look through the bellows camera. Turn its focus ring until the stars become sharp.',
          'Set the camera’s focus ring to VII and take the glass plate.',
        ]
      : !s.plate
        ? [
            'The parchment on the wall remembers the photographer’s method.',
            'Moon wakes silver. Rain stills it. A star keeps it forever.',
            'Lower the plate into the moon bath, then the rain bath, then the star bath.',
          ]
        : [
            'Your developed plate carries two constellations. Perhaps the magic lantern can read them.',
            'The horizontal constellation has two stars. The vertical one has three.',
            'Insert the plate into the lantern. Set horizontal II, vertical III, then release the light.',
          ];
  return clues[Math.min(level, 2)]!;
}
