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
  const sequence = action === order[s.sequence.length] ? [...s.sequence, action] : s.sequence;
  return { ...s, sequence, breakfast: sequence.length === 3 };
}
function darkroom(s: Game, action: Action): Game {
  if (action === 'takeplate') return { ...s, negative: true };
  const order = ['develop', 'stop', 'fix'];
  if (s.plate || !s.negative || !order.includes(action)) return s;
  const bath = action === order[s.bath] ? s.bath + 1 : s.bath;
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
        'Ved blomsterne ligger en invitation. Nogen har gemt et lille ritual til dig.',
        'Hvad hæver før daggry? Hvad serveres med et ønske? Hvad jager søvnen væk?',
        'Rør ved bollerne, så kagen og til sidst kaffekoppen.',
      ]
    : !s.negative
      ? [
          'Fotografens kamera står klar til ét sidste billede.',
          'Kig gennem bælgkameraet. Drej fokusringen, til stjernerne står skarpt.',
          'Stil kameraets fokusring på VII, og tag glaspladen.',
        ]
      : !s.plate
        ? [
            'Papiret på væggen gemmer fotografens opskrift.',
            'Månen vækker sølvet. Regnen giver ro. Stjernen gemmer det for altid.',
            'Sænk pladen i månebadet, så regnbadet og til sidst stjernebadet.',
          ]
        : [
            'Din glasplade viser to stjernebilleder. Måske kan tryllelygten læse dem.',
            'Det vandrette stjernebillede har to stjerner. Det lodrette har tre.',
            'Sæt pladen i lygten. Vælg vandret II og lodret III, og slip lyset fri.',
          ];
  return clues[Math.min(level, 2)]!;
}
