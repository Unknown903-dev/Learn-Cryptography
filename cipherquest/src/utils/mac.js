import { EIGHT_BITS } from "./otp.js";

export function bitsToBytes(bits) {
  if (!EIGHT_BITS.test(bits)) {
    throw new Error("Expected exactly eight binary digits.");
  }

  return new Uint8Array([Number.parseInt(bits, 2)]);
}

export async function generateHmacKey() {
  return crypto.subtle.generateKey(
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createHmacTag(key, bits) {
  return crypto.subtle.sign("HMAC", key, bitsToBytes(bits));
}

export async function verifyHmacTag(key, tag, bits) {
  return crypto.subtle.verify("HMAC", key, tag, bitsToBytes(bits));
}

export function tagToHex(tag) {
  return Array.from(new Uint8Array(tag), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
