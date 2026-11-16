export type Point = { x: number; y: number };
type Creature = Point & { angle: number };
export type World = { creatures: Creature[]; food: Point[]; eaten: number; time: number };

export function makeWorld(): World {
  return {
    creatures: Array.from({ length: 16 }, (_, i) => ({ x: 180 + (i % 4) * 140, y: 100 + Math.floor(i / 4) * 85, angle: i * 2.4 })),
    food: Array.from({ length: 32 }, (_, i) => ({ x: 35 + ((i * 137) % 730), y: 35 + ((i * 83) % 390) })),
    eaten: 0, time: 0,
  };
}

function nearestFood(creature: Point, food: Point[], sight: number) {
  let target: Point | undefined;
  let distance = sight;
  for (const point of food) {
    const gap = Math.hypot(point.x - creature.x, point.y - creature.y);
    if (gap < distance) { target = point; distance = gap; }
  }
  return { target, distance };
}

export function stepWorld(world: World, dt: number, speed: number, sight: number): World {
  const food = [...world.food];
  let eaten = world.eaten;
  const creatures = world.creatures.map((creature, index) => {
    const { target, distance } = nearestFood(creature, food, sight);
    let angle = target
      ? Math.atan2(target.y - creature.y, target.x - creature.x)
      : creature.angle + Math.sin(world.time * 0.7 + index * 2.4) * dt;
    const travel = Math.min(speed * dt, target ? distance : Infinity);
    let x = creature.x + Math.cos(angle) * travel;
    let y = creature.y + Math.sin(angle) * travel;
    if (x < 12 || x > 788) { angle = Math.PI - angle; x = Math.max(12, Math.min(788, x)); }
    if (y < 12 || y > 448) { angle = -angle; y = Math.max(12, Math.min(448, y)); }
    if (target && Math.hypot(target.x - x, target.y - y) < 9) {
      food.splice(food.indexOf(target), 1);
      eaten++;
    }
    return { x, y, angle };
  });
  return { creatures, food, eaten, time: world.time + dt };
}
