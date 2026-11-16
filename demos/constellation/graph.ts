export interface Link { source: string; target: string }

/** Reverse the dependency arrows: changing a target may affect its consumers. */
export function impactOf(id: string, links: Link[]): Map<string, number> {
  const distances = new Map([[id, 0]]);
  for (const [target, distance] of distances) {
    for (const link of links) {
      if (link.target === target && !distances.has(link.source)) distances.set(link.source, distance + 1);
    }
  }
  return distances;
}
