import { tr } from './language.ts';
export type Action =
  | 'bun'
  | 'cake'
  | 'cup'
  | 'develop'
  | 'stop'
  | 'fix'
  | 'lightwick'
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
    wickLit: false,
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
  if (!s.inserted) return s;
  if (action === 'lightwick') return { ...s, wickLit: true };
  if (action === 'horizontal') return { ...s, horizontal: (s.horizontal + 1) % 4 };
  if (action === 'vertical') return { ...s, vertical: (s.vertical + 1) % 4 };
  if (action === 'project' && s.wickLit && s.horizontal === 1 && s.vertical === 2)
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

const hints = {
  stairs: [
    [
      'Trappen til højre er åben. Loftet venter.',
      'The stairs on the right are open. The attic awaits.',
    ],
    [
      'Følg det gyldne lys ved trappen til højre.',
      'Follow the golden glow by the stairs on the right.',
    ],
    ['Tryk på “Til loftet — åbent” ved trappen.', 'Choose “To the attic — open” by the stairs.'],
  ],
  table: [
    [
      'Ved blomsterne ligger en invitation. Nogen har gemt et lille ritual til dig.',
      'There’s an invitation by the flowers. Someone has left you a little ritual.',
    ],
    [
      'Hvad hæver før daggry? Hvad serveres med et ønske? Hvad jager søvnen væk?',
      'What rises before dawn? What comes with a wish? What chases sleep away?',
    ],
    [
      'Rør ved bollerne, så kagen og til sidst kaffekoppen.',
      'Touch the buns, then the cake, then the coffee cup.',
    ],
  ],
  camera: [
    [
      'Fotografens kamera står klar til ét sidste billede.',
      'The photographer’s camera is ready for one last picture.',
    ],
    [
      'Kig gennem bælgkameraet. Drej fokusringen, til stjernerne står skarpt.',
      'Look through the bellows camera. Turn the focus ring until the stars are sharp.',
    ],
    [
      'Stil kameraets fokusring på VII, og tag glaspladen.',
      'Set the focus ring to VII and take the glass plate.',
    ],
  ],
  door: [
    ['Der er lys omkring døren.', 'Light spills around the door.'],
    [
      'Følg lyset fra skabet hen til mørkekammeret.',
      'Follow the light from the cabinet to the darkroom.',
    ],
    ['Åbn døren til mørkekammeret.', 'Open the darkroom door.'],
  ],
  baths: [
    [
      'Papiret på væggen gemmer fotografens opskrift.',
      'The paper on the wall holds the photographer’s recipe.',
    ],
    [
      'Månen vækker sølvet. Regnen giver ro. Stjernen gemmer mindet.',
      'The moon wakes the silver. The rain settles it. The star keeps the memory.',
    ],
    [
      'Sænk pladen i månebadet, så regnbadet og til sidst stjernebadet.',
      'Dip the plate in the moon bath, then the rain bath, then the star bath.',
    ],
  ],
  insert: [
    ['Der er en tom sprække i tryllelygten.', 'There’s an empty slot in the magic lantern.'],
    ['Din glasplade passer til sprækken.', 'Your glass plate fits the slot.'],
    [
      'Sæt den fremkaldte plade i tryllelygten.',
      'Insert the developed plate in the magic lantern.',
    ],
  ],
  wick: [
    ['Nissen venter ved sin lille lygte.', 'The house elf is waiting by his little lantern.'],
    [
      'Se efter mærket på skodderne. Kan du finde det på nissens lygte?',
      'Look for the mark on the shutters. Can you find it on the elf’s lantern?',
    ],
    [
      'Vælg solen på nissens lygte for at tænde vægen.',
      'Choose the sun on the elf’s lantern to light the wick.',
    ],
  ],
  dials: [
    ['Tag lyset med tilbage til tryllelygten.', 'Bring the light back to the magic lantern.'],
    [
      'Tæl de vandrette og lodrette stjerner på glaspladen.',
      'Count the horizontal and vertical stars on the glass plate.',
    ],
    [
      'Vælg vandret II og lodret III på tryllelygten, og slip lyset fri.',
      'Set the magic lantern to horizontal II and vertical III, then release the light.',
    ],
  ],
} as const;

function hintStage(s: Game): keyof typeof hints {
  if (s.room === 0) return s.breakfast ? 'door' : 'table';
  if (s.room === 1) {
    if (s.plate) return 'stairs';
    return s.negative ? 'baths' : 'camera';
  }
  if (!s.inserted) return 'insert';
  return s.wickLit ? 'dials' : 'wick';
}

export function hint(s: Game, level = 0) {
  const [da, en] = hints[hintStage(s)][Math.min(level, 2)]!;
  return tr(da, en);
}
