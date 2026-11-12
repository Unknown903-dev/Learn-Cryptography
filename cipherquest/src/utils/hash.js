export async function sha256(message) {
  const encodedMessage = new TextEncoder().encode(message);
  const digest = await crypto.subtle.digest("SHA-256", encodedMessage);
  const bytes = new Uint8Array(digest);
  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

  return { bytes, hex };
}

export function countDifferingBits(left, right) {
  if (left.length !== right.length) {
    throw new Error("Digests must have the same length.");
  }

  let differenceCount = 0;

  for (let index = 0; index < left.length; index += 1) {
    let difference = left[index] ^ right[index];

    while (difference > 0) {
      differenceCount += difference & 1;
      difference >>>= 1;
    }
  }

  return differenceCount;
}

export async function findEightBitCollision(
  seed = "cipherquest",
  shouldContinue = () => true,
) {
  const prefixes = new Map();

  // There are only 256 one-byte prefixes, so 257 distinct inputs guarantee a match.
  for (let index = 0; index <= 256; index += 1) {
    const input = `${seed} sample ${index}`;
    const digest = await sha256(input);

    if (!shouldContinue()) {
      return null;
    }

    const prefix = digest.bytes[0];
    const previous = prefixes.get(prefix);

    if (previous) {
      return {
        prefix,
        attempts: index + 1,
        first: previous,
        second: { input, digest },
      };
    }

    prefixes.set(prefix, { input, digest });
  }

  throw new Error("No 8-bit collision found within the guaranteed search space.");
}
