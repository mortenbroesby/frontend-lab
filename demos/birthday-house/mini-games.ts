export const mirrorTargets = [3, 3, 1];
export const mirrorPoints = [
  [25, 55],
  [25, 22],
  [73, 22],
];
export function connectedMirrors(turns: number[]) {
  const firstWrong = mirrorTargets.findIndex((target, i) => turns[i] !== target);
  return firstWrong < 0 ? 3 : firstWrong;
}
export function lightPath(turns: number[]) {
  const path: number[][] = [[8, 55]];
  let direction = [1, 0];
  for (let i = 0; i < 3; i++) {
    const point = mirrorPoints[i]!;
    path.push(point);
    const angle = (turns[i]! * Math.PI) / 4;
    const axis = [Math.cos(angle), Math.sin(angle)];
    const dot = direction[0]! * axis[0]! + direction[1]! * axis[1]!;
    direction = [2 * dot * axis[0]! - direction[0]!, 2 * dot * axis[1]! - direction[1]!];
    if (turns[i] !== mirrorTargets[i]) {
      path.push([point[0]! + direction[0]! * 90, point[1]! + direction[1]! * 90]);
      return path;
    }
  }
  path.push([73, 55]);
  return path;
}
export function swapCups(order: number[], a: number, b: number) {
  const next = [...order];
  [next[a], next[b]] = [next[b]!, next[a]!];
  return next;
}
export function cupAt(order: number[], slot: number) {
  return order[slot];
}
