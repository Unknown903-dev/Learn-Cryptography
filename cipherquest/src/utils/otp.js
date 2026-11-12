export const EIGHT_BITS = /^[01]{8}$/;

export function xorBits(left, right) {
  if (!EIGHT_BITS.test(left) || !EIGHT_BITS.test(right)) {
    return null;
  }

  return left
    .split("")
    .map((bit, index) => Number(bit) ^ Number(right[index]))
    .join("");
}

export function generateRandomBits() {
  const randomBytes = new Uint8Array(8);
  crypto.getRandomValues(randomBytes);

  return Array.from(randomBytes, (value) => value & 1).join("");
}
