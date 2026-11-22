import portraitBreakfast from './art/breakfast-portrait.jpg';
import portraitDarkroom from './art/darkroom-portrait.jpg';
import portraitAttic from './art/attic-portrait.jpg';
const portraitArt = [portraitBreakfast, portraitDarkroom, portraitAttic];
import breakfast from './art/breakfast.jpg';
import darkroom from './art/darkroom.jpg';
import attic from './art/attic.jpg';
export type ObjectId =
  | 'note'
  | 'bun'
  | 'cake'
  | 'cup'
  | 'cabinet'
  | 'darkroom'
  | 'breakfast'
  | 'attic'
  | 'camera'
  | 'recipe'
  | 'develop'
  | 'stop'
  | 'fix'
  | 'projector'
  | 'frame'
  | 'letter'
  | 'window'
  | 'lamp';
export type Spot = { id: ObjectId; name: string; x: number; y: number; mark?: string };
export const locations: { name: string; subtitle: string; art: string; spots: Spot[] }[] = [
  {
    name: 'The birthday room',
    subtitle: 'A place has been kept for you.',
    art: breakfast,
    spots: [
      { id: 'note', name: 'The sealed invitation', x: 20, y: 61, mark: '✉' },
      { id: 'bun', name: 'The birthday buns', x: 27, y: 71 },
      { id: 'cake', name: 'The birthday cake', x: 50, y: 61 },
      { id: 'cup', name: 'The porcelain cup', x: 79, y: 72 },
      { id: 'cabinet', name: 'The cabinet of little lights', x: 59, y: 23 },
      { id: 'window', name: 'The blue-hour window', x: 13, y: 29 },
      { id: 'darkroom', name: 'The darkroom door', x: 94, y: 45, mark: '↗' },
    ],
  },
  {
    name: 'The room of silver',
    subtitle: 'Some memories need a little darkness.',
    art: darkroom,
    spots: [
      { id: 'breakfast', name: 'Back to the birthday room', x: 6, y: 43, mark: '↖' },
      { id: 'recipe', name: 'The photographer’s recipe', x: 29, y: 41, mark: '✧' },
      { id: 'camera', name: 'The bellows camera', x: 79, y: 47 },
      { id: 'develop', name: 'The moon bath', x: 29, y: 79 },
      { id: 'stop', name: 'The rain bath', x: 50, y: 79 },
      { id: 'fix', name: 'The star bath', x: 71, y: 79 },
      { id: 'attic', name: 'The attic stairs', x: 94, y: 39, mark: '↗' },
    ],
  },
  {
    name: 'The room of borrowed light',
    subtitle: 'One last secret, under the rafters.',
    art: attic,
    spots: [
      { id: 'darkroom', name: 'Back to the darkroom', x: 5, y: 46, mark: '↖' },
      { id: 'projector', name: 'The magic lantern', x: 39, y: 64 },
      { id: 'frame', name: 'The sun-carved shutters', x: 59, y: 40 },
      { id: 'letter', name: 'The three letters', x: 62, y: 77, mark: '✉' },
      { id: 'lamp', name: 'The stained-glass lamp', x: 78, y: 60 },
      { id: 'window', name: 'The blue-hour window', x: 27, y: 35 },
    ],
  },
];

export type RoomView = ReturnType<typeof roomView>;
const portraitPositions: Partial<Record<ObjectId, [number, number]>>[] = [
  {
    note: [23, 58],
    bun: [27, 66],
    cake: [52, 61],
    cup: [77, 66],
    cabinet: [58, 34.5],
    window: [16, 38],
    darkroom: [94, 45],
  },
  {
    breakfast: [9, 46],
    recipe: [28, 44],
    camera: [80, 52],
    develop: [23, 77],
    stop: [49, 77],
    fix: [74, 77],
    attic: [94, 42],
  },
  {
    darkroom: [5, 47],
    projector: [40, 60],
    frame: [58, 39],
    letter: [64, 68],
    lamp: [78, 56],
    window: [24, 39],
  },
];
export function roomView(room: number, portrait: boolean) {
  const base = locations[room]!;
  return {
    ...base,
    room,
    portrait,
    width: portrait ? 9 : 16,
    height: portrait ? 16 : 9,
    art: portrait ? portraitArt[room]! : base.art,
    spots: base.spots.map((spot) => {
      const position = portrait && portraitPositions[room]![spot.id];
      return position ? { ...spot, x: position[0], y: position[1] } : spot;
    }),
  };
}
