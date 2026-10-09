/** Uniform integers for the educational demos; never fall back to Math.random. */
export function randomInteger(min: number, max: number): number {
  const range = max - min + 1;
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || range < 1 || range > 2 ** 32) {
    throw new RangeError('Random integer bounds must define a valid 32-bit range');
  }
  const mask = 2 ** Math.ceil(Math.log2(range)) - 1;
  const words = new Uint32Array(1);
  let candidate: number;
  // Mask to a power-of-two range and reject excess values to avoid modulo bias.
  do {
    crypto.getRandomValues(words);
    candidate = (words[0] & mask) >>> 0;
  } while (candidate >= range);
  return min + candidate;
}
