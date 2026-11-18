/** Small, origin-checked contract between a presentation and an independent demo. */
type EmbedMessage = {
  type: 'lab:demo-ready' | 'lab:demo-enter' | 'lab:demo-exit' | 'lab:demo-return';
};
export function isEmbedMessage(
  event: { source: unknown; origin: string; data: unknown },
  source: unknown,
  origin: string,
): event is { source: unknown; origin: string; data: EmbedMessage } {
  if (!source || event.source !== source || event.origin !== origin) return false;
  const data = event.data;
  if (!data || typeof data !== 'object' || !('type' in data)) return false;
  return ['lab:demo-ready', 'lab:demo-enter', 'lab:demo-exit', 'lab:demo-return'].includes(
    data.type as string,
  );
}
