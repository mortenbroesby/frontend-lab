import { tr } from './language.ts';
import portraitBreakfast from './art/breakfast-clean-portrait.png';
import portraitDarkroom from './art/darkroom-clean-portrait.png';
import portraitAttic from './art/attic-clean-portrait.png';
const portraitArt = [portraitBreakfast, portraitDarkroom, portraitAttic];
import breakfast from './art/breakfast-clean.png';
import darkroom from './art/darkroom-clean.png';
import attic from './art/attic-clean.png';
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
type Spot = { id: ObjectId; name: string; x: number; y: number; mark?: string };
type Label = [danish: string, english: string];
type RoomData = {
  name: Label;
  subtitle: Label;
  art: string;
  spots: (Omit<Spot, 'name'> & { name: Label })[];
};
const locations: RoomData[] = [
  {
    name: ['Fødselsdagsstuen', 'The Birthday Room'],
    subtitle: ['Der er dækket op til dig.', 'There’s a place set for you.'],
    art: breakfast,
    spots: [
      {
        id: 'note',
        name: ['Den forseglede invitation', 'The sealed invitation'],
        x: 24,
        y: 67,
        mark: '✉',
      },
      { id: 'bun', name: ['Fødselsdagsbollerne', 'The birthday buns'], x: 34, y: 79 },
      { id: 'cake', name: ['Fødselsdagskagen', 'The birthday cake'], x: 52.3, y: 65 },
      { id: 'cup', name: ['Porcelænskoppen', 'The porcelain cup'], x: 72.7, y: 76.5 },
      {
        id: 'cabinet',
        name: ['Skabet med de små lys', 'The cabinet of little lights'],
        x: 64.4,
        y: 35.6,
      },
      { id: 'window', name: ['Vinduet i den blå time', 'The twilight window'], x: 18, y: 33 },
      {
        id: 'darkroom',
        name: ['Døren til mørkekammeret', 'The darkroom door'],
        x: 89,
        y: 51,
        mark: '↗',
      },
    ],
  },
  {
    name: ['Sølvkammeret', 'The Silver Chamber'],
    subtitle: ['Nogle minder har brug for lidt mørke.', 'Some memories need a little darkness.'],
    art: darkroom,
    spots: [
      {
        id: 'breakfast',
        name: ['Tilbage til fødselsdagsstuen', 'Back to the birthday room'],
        x: 6,
        y: 43,
        mark: '↖',
      },
      {
        id: 'recipe',
        name: ['Fotografens opskrift', 'The photographer’s recipe'],
        x: 29,
        y: 41,
        mark: '✧',
      },
      { id: 'camera', name: ['Bælgkameraet', 'The bellows camera'], x: 79, y: 47 },
      { id: 'develop', name: ['Månebadet', 'The moon bath'], x: 29, y: 79 },
      { id: 'stop', name: ['Regnbadet', 'The rain bath'], x: 50, y: 79 },
      { id: 'fix', name: ['Stjernebadet', 'The star bath'], x: 71, y: 79 },
      { id: 'attic', name: ['Trappen til loftet', 'The attic stairs'], x: 94, y: 39, mark: '↗' },
    ],
  },
  {
    name: ['Rummet med det lånte lys', 'The Room of Borrowed Light'],
    subtitle: ['En sidste hemmelighed under bjælkerne.', 'One last secret beneath the rafters.'],
    art: attic,
    spots: [
      {
        id: 'darkroom',
        name: ['Tilbage til mørkekammeret', 'Back to the darkroom'],
        x: 5,
        y: 46,
        mark: '↖',
      },
      { id: 'projector', name: ['Tryllelygten', 'The magic lantern'], x: 39, y: 64 },
      { id: 'frame', name: ['Skodderne med solen', 'The sun shutters'], x: 59, y: 40 },
      { id: 'letter', name: ['De tre breve', 'The three letters'], x: 62, y: 77, mark: '✉' },
      { id: 'lamp', name: ['Messinglygten', 'The brass lantern'], x: 78, y: 60 },
      { id: 'window', name: ['Vinduet i den blå time', 'The twilight window'], x: 27, y: 35 },
    ],
  },
];

export function getLocation(room: number) {
  const { name, subtitle, art, spots } = locations[room]!;
  return {
    name: tr(...name),
    subtitle: tr(...subtitle),
    art,
    spots: spots.map((spot) => ({ ...spot, name: tr(...spot.name) })),
  };
}

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
  const base = getLocation(room);
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
