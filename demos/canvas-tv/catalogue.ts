export type Programme = {
  title: string;
  genre: string;
  description: string;
  hue: number;
  seed: number;
};
export const rows: { title: string; programmes: Programme[] }[] = [
  {
    title: 'Beyond the familiar',
    programmes: [
      {
        title: 'The Quiet Orbit',
        genre: 'SCIENCE FICTION · 1H 42M',
        description: 'At the edge of a silent solar system, one signal changes everything.',
        hue: 175,
        seed: 1,
      },
      {
        title: 'After the Rain',
        genre: 'DRAMA · 1H 28M',
        description: 'Two strangers trace a forgotten route through a city waking up.',
        hue: 235,
        seed: 2,
      },
      {
        title: 'Wild Latitude',
        genre: 'DOCUMENTARY · 6 EPISODES',
        description: 'Follow the light into landscapes that refuse to stand still.',
        hue: 145,
        seed: 3,
      },
      {
        title: 'Sunward',
        genre: 'ADVENTURE · 1H 36M',
        description: 'A small crew sets out for the last warm place on the map.',
        hue: 28,
        seed: 4,
      },
      {
        title: 'Blue Hours',
        genre: 'MUSIC · 52 MIN',
        description: 'A city, a rooftop and a concert between night and morning.',
        hue: 205,
        seed: 5,
      },
      {
        title: 'Elsewhere',
        genre: 'ANIMATION · 1H 14M',
        description: 'An unlikely traveller discovers a world beyond the horizon.',
        hue: 285,
        seed: 6,
      },
    ],
  },
  {
    title: 'A different perspective',
    programmes: [
      {
        title: 'Low Tide',
        genre: 'DOCUMENTARY · 48 MIN',
        description: 'The coast reveals a hidden world when the water retreats.',
        hue: 190,
        seed: 7,
      },
      {
        title: 'Night Assembly',
        genre: 'THRILLER · 1H 32M',
        description: 'One late shift. An empty station. A message meant for someone else.',
        hue: 260,
        seed: 8,
      },
      {
        title: 'Terracotta',
        genre: 'DESIGN · 4 EPISODES',
        description: 'Meet the people building a slower, more colourful world.',
        hue: 16,
        seed: 9,
      },
      {
        title: 'Open Country',
        genre: 'ADVENTURE · 1H 24M',
        description: 'No itinerary. Just a compass and a road that keeps going.',
        hue: 90,
        seed: 10,
      },
      {
        title: 'Small Signals',
        genre: 'SCIENCE · 3 EPISODES',
        description: 'Extraordinary discoveries hiding inside ordinary things.',
        hue: 320,
        seed: 11,
      },
      {
        title: 'First Light',
        genre: 'SHORT FILM · 22 MIN',
        description: 'A new beginning, told in the space of a single sunrise.',
        hue: 45,
        seed: 12,
      },
    ],
  },
];
