import { generateRandomBits, xorBits } from "./otp.js";

export function createCpaRound() {
  return {
    pad: generateRandomBits(),
    frozenCandidates: null,
    challenge: null,
    guess: null,
    queries: [],
  };
}

export function encryptInRound(message, pad) {
  return xorBits(message, pad);
}

export function chooseRandomBit() {
  const randomByte = new Uint8Array(1);
  crypto.getRandomValues(randomByte);
  return randomByte[0] & 1;
}
