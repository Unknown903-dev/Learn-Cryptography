export const REUSED_PAD_CIPHERTEXTS = {
  first:
    "3c1e3072421812a917d3db874875849eead80bda92f15a4d3b78b5d2d4bba02e",
  second:
    "2c0424672e167dbf01bcc2f4296fed97edde19d3fefa3b582a78c3a2b3c5a02e",
};

export function hexToBytes(hex) {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) {
    throw new Error("Ciphertext must contain complete hexadecimal bytes.");
  }

  return Uint8Array.from(
    hex.match(/.{2}/g).map((byte) => Number.parseInt(byte, 16)),
  );
}

export function bytesToHex(bytes) {
  return Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export function xorCiphertexts(firstHex, secondHex) {
  const first = hexToBytes(firstHex);
  const second = hexToBytes(secondHex);

  if (first.length !== second.length) {
    throw new Error("Ciphertexts must have equal byte lengths.");
  }

  return Uint8Array.from(first, (byte, index) => byte ^ second[index]);
}

export function getMaximumOffset(messageLength, guess) {
  const guessLength = new TextEncoder().encode(guess).length;
  return Math.max(0, messageLength - guessLength);
}

export function clampOffset(offset, messageLength, guess) {
  return Math.min(
    Math.max(0, Number.isFinite(offset) ? Math.trunc(offset) : 0),
    getMaximumOffset(messageLength, guess),
  );
}

export function deriveOtherMessageBytes(xorBytes, guess, offset) {
  const guessBytes = new TextEncoder().encode(guess);
  const safeOffset = clampOffset(offset, xorBytes.length, guess);

  if (guessBytes.length === 0 || guessBytes.length > xorBytes.length) {
    return new Uint8Array();
  }

  return Uint8Array.from(
    guessBytes,
    (byte, index) => byte ^ xorBytes[safeOffset + index],
  );
}

export function describeCandidateByte(byte) {
  const printable = byte >= 32 && byte <= 126;
  return {
    byte,
    printable,
    text: printable ? String.fromCharCode(byte) : `0x${byte.toString(16).padStart(2, "0")}`,
  };
}

export function normalizeCodeWord(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}
