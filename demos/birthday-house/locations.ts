import portraitBreakfast from './art/breakfast-clean-portrait.png';
import portraitDarkroom from './art/darkroom-portrait.jpg';
import portraitAttic from './art/attic-portrait.jpg';
const portraitArt = [portraitBreakfast, portraitDarkroom, portraitAttic];
import breakfast from './art/breakfast-clean.png';
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
    name: 'Fødselsdagsstuen',
    subtitle: 'Der er dækket op til dig.',
    art: breakfast,
    spots: [
      { id: 'note', name: 'Den forseglede invitation', x: 24, y: 67, mark: '✉' },
      { id: 'bun', name: 'Fødselsdagsbollerne', x: 34, y: 79 },
      { id: 'cake', name: 'Fødselsdagskagen', x: 52.3, y: 65 },
      { id: 'cup', name: 'Porcelænskoppen', x: 72.7, y: 76.5 },
      { id: 'cabinet', name: 'Skabet med de små lys', x: 64.4, y: 35.6 },
      { id: 'window', name: 'Vinduet i den blå time', x: 18, y: 33 },
      { id: 'darkroom', name: 'Døren til mørkekammeret', x: 89, y: 51, mark: '↗' },
    ],
  },
  {
    name: 'Sølvkammeret',
    subtitle: 'Nogle minder har brug for lidt mørke.',
    art: darkroom,
    spots: [
      { id: 'breakfast', name: 'Tilbage til fødselsdagsstuen', x: 6, y: 43, mark: '↖' },
      { id: 'recipe', name: 'Fotografens opskrift', x: 29, y: 41, mark: '✧' },
      { id: 'camera', name: 'Bælgkameraet', x: 79, y: 47 },
      { id: 'develop', name: 'Månebadet', x: 29, y: 79 },
      { id: 'stop', name: 'Regnbadet', x: 50, y: 79 },
      { id: 'fix', name: 'Stjernebadet', x: 71, y: 79 },
      { id: 'attic', name: 'Trappen til loftet', x: 94, y: 39, mark: '↗' },
    ],
  },
  {
    name: 'Rummet med det lånte lys',
    subtitle: 'En sidste hemmelighed under bjælkerne.',
    art: attic,
    spots: [
      { id: 'darkroom', name: 'Tilbage til mørkekammeret', x: 5, y: 46, mark: '↖' },
      { id: 'projector', name: 'Tryllelygten', x: 39, y: 64 },
      { id: 'frame', name: 'Skodderne med solen', x: 59, y: 40 },
      { id: 'letter', name: 'De tre breve', x: 62, y: 77, mark: '✉' },
      { id: 'lamp', name: 'Lampen med det farvede glas', x: 78, y: 60 },
      { id: 'window', name: 'Vinduet i den blå time', x: 27, y: 35 },
    ],
  },
];

export type RoomView = ReturnType<typeof roomView>;
const portraitPositions: Partial<Record<ObjectId, [number, number]>>[] = [
  {
    note: [23, 61],
    bun: [33, 67],
    cake: [54, 60],
    cup: [74, 65.6],
    cabinet: [60, 37.9],
    window: [19, 35],
    darkroom: [86, 44.5],
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
