import { tr } from './language.ts';
import { connectedMirrors } from './mini-games.ts';
export type Action =
  | 'bun'
  | 'cake'
  | 'cup'
  | 'mirror0'
  | 'mirror1'
  | 'mirror2'
  | 'nissegift'
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
    mirrors: [0, 0, 0],
    nisseGift: false,
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
  const index = ['mirror0', 'mirror1', 'mirror2'].indexOf(action);
  if (s.plate || !s.negative || index < 0) return s;
  const mirrors = [...s.mirrors];
  mirrors[index] = (mirrors[index]! + 1) % 4;
  return { ...s, mirrors, plate: connectedMirrors(mirrors) === 3 };
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
  if (action === 'nissegift') return { ...s, nisseGift: true };
  if (action === 'readnote') return { ...s, note: true };
  if (action === 'readrecipe') return { ...s, recipe: true };
  if (action === 'breakfast') return { ...s, room: 0 };
  if (action === 'darkroom' && s.breakfast) return { ...s, room: 1 };
  if (action === 'attic' && s.plate) return { ...s, room: 2 };
  return [breakfast, darkroom, attic][s.room]!(s, action);
}
export function hint(s: Game, level = 0) {
  if (s.plate && s.room === 1)
    return [
      tr(
        'Trappen til højre er åben. Loftet venter.',
        'The stairs on the right are open. The attic awaits.',
      ),
      tr(
        'Følg det gyldne lys ved trappen til højre.',
        'Follow the golden glow by the stairs on the right.',
      ),
      tr(
        'Tryk på “Til loftet — åbent” ved trappen.',
        'Choose “To the attic — open” by the stairs.',
      ),
    ][Math.min(level, 2)]!;
  const clues = !s.breakfast
    ? [
        tr(
          'Ved blomsterne ligger en invitation. Nogen har gemt et lille ritual til dig.',
          'There’s an invitation by the flowers. Someone has left you a little ritual.',
        ),
        tr(
          'Hvad hæver før daggry? Hvad serveres med et ønske? Hvad jager søvnen væk?',
          'What rises before dawn? What comes with a wish? What chases sleep away?',
        ),
        tr(
          'Rør ved bollerne, så kagen og til sidst kaffekoppen.',
          'Touch the buns, then the cake, then the coffee cup.',
        ),
      ]
    : !s.negative
      ? [
          tr(
            'Fotografens kamera står klar til ét sidste billede.',
            'The photographer’s camera is ready for one last picture.',
          ),
          tr(
            'Kig gennem bælgkameraet. Drej fokusringen, til stjernerne står skarpt.',
            'Look through the bellows camera. Turn the focus ring until the stars are sharp.',
          ),
          tr(
            'Stil kameraets fokusring på VII, og tag glaspladen.',
            'Set the focus ring to VII and take the glass plate.',
          ),
        ]
      : !s.plate
        ? [
            tr(
              'Nissens stjernelygte venter ved badene.',
              'The elf’s star lantern is waiting by the trays.',
            ),
            tr(
              'Drej de tre spejle, så lyset finder glaspladen.',
              'Turn the three mirrors to guide the light onto the glass plate.',
            ),
            tr(
              'Spejl 1: tre klik. Spejl 2: tre klik. Spejl 3: ét klik fra start.',
              'From the starting positions, turn mirror 1 three times, mirror 2 three times and mirror 3 once.',
            ),
          ]
        : [
            tr(
              'Din glasplade viser to stjernebilleder. Måske kan tryllelygten læse dem.',
              'Your glass plate shows two constellations. Perhaps the magic lantern can read them.',
            ),
            tr(
              'Det vandrette stjernebillede har to stjerner. Det lodrette har tre.',
              'The horizontal constellation has two stars. The vertical one has three.',
            ),
            tr(
              'Sæt pladen i lygten. Vælg vandret II og lodret III, og slip lyset fri.',
              'Slide the plate into the lantern. Set horizontal to II and vertical to III, then release the light.',
            ),
          ];
  return clues[Math.min(level, 2)]!;
}
