export const MAX_LIMIT = 2_000_000;

export function countPrimes(limit: number): number {
  if (!Number.isInteger(limit) || limit < 2 || limit > MAX_LIMIT) {
    throw new RangeError(`Choose an integer between 2 and ${MAX_LIMIT}.`);
  }
  let count = 1; // Two is the only even prime.
  for (let candidate = 3; candidate <= limit; candidate += 2) {
    let prime = true;
    for (let divisor = 3; divisor * divisor <= candidate; divisor += 2) {
      if (candidate % divisor === 0) {
        prime = false;
        break;
      }
    }
    if (prime) count += 1;
  }
  return count;
}
