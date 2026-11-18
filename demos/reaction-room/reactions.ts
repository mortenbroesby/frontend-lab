export const reactions = [
  { emoji: '🚀', label: 'Rocket' },
  { emoji: '✨', label: 'Sparkle' },
  { emoji: '💜', label: 'Heart' },
  { emoji: '👏', label: 'Applause' },
  { emoji: '😂', label: 'Laugh' },
  { emoji: '⚡', label: 'Lightning' },
];
export const capacity = 30;
export type Reaction = { emoji: string; sender: string; at: number };
export function validRoomCode(code: string) {
  return /^[a-z0-9-]{1,24}$/.test(code);
}
export function createRoomCode() {
  const words = ['cosmic', 'neon', 'lunar', 'sunny', 'mint', 'tiny', 'happy', 'wild'];
  const animals = ['otter', 'panda', 'fox', 'owl', 'koala', 'tiger', 'whale', 'gecko'];
  const random = crypto.getRandomValues(new Uint32Array(3));
  return `${words[random[0] % words.length]}-${animals[random[1] % animals.length]}-${random[2].toString(36)}`;
}
export function validBatch(value: unknown): value is string[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > 2) return false;
  return value.every((emoji) => reactions.some((reaction) => reaction.emoji === emoji));
}
export function hotReactions(events: Reaction[], now: number) {
  return reactions
    .filter(({ emoji }) => {
      const recent = events.filter((event) => event.emoji === emoji && now - event.at < 4000);
      return recent.length >= 8 && new Set(recent.map((event) => event.sender)).size >= 3;
    })
    .map(({ emoji }) => emoji);
}
