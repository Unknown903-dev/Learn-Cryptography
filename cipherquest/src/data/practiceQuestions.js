export const practiceQuestions = [
  {
    id: "perfect-secrecy-definition",
    topic: "Perfect Secrecy",
    question: "What does perfect secrecy mean?",
    options: [
      "The ciphertext reveals no information about the message.",
      "The key is stored securely.",
      "The encryption algorithm is secret.",
      "The message is deleted after encryption.",
    ],
    answer: 0,
    explanation:
      "Perfect secrecy means that learning the ciphertext does not change the attacker's probability distribution over the message.",
    lesson: { label: "Perfect Secrecy", path: "/perfect-secrecy" },
  },
  {
    id: "identity-encryption",
    topic: "Attack Simulator",
    question: "Which scheme is obviously insecure?",
    options: [
      "Enc(k, m) = m XOR k with random one-time key",
      "Enc(k, m) = m",
      "Enc(k, m) = m + k mod n with uniform k",
      "One-time pad",
    ],
    answer: 1,
    explanation:
      "Enc(k, m) = m is insecure because the ciphertext is exactly the original message.",
    lesson: { label: "Attack Simulator", path: "/attack-simulator" },
  },
  {
    id: "ctr-nonce-reuse",
    topic: "CTR Mode",
    question: "What is dangerous in CTR mode?",
    options: [
      "Using a counter",
      "Using XOR",
      "Reusing the same nonce with the same key",
      "Encrypting more than one block",
    ],
    answer: 2,
    explanation:
      "CTR mode becomes insecure if the same nonce is reused with the same key because it can reuse the same keystream.",
    lesson: { label: "CTR Mode", path: "/modes" },
  },
  {
    id: "conditional-denominator",
    topic: "Probability Basics",
    question:
      "Two fair dice are rolled. After learning that the first die is 6, what denominator should you use for the probability that the sum is 8?",
    options: ["1", "6", "8", "36"],
    answer: 1,
    explanation:
      "Conditioning on the first die being 6 leaves only six possible ordered outcomes: (6, 1) through (6, 6).",
    lesson: { label: "Probability Basics", path: "/probability-basics" },
  },
  {
    id: "biased-prior-perfect-secrecy",
    topic: "Perfect Secrecy",
    question:
      "An attacker initially believes M = 0 with probability 80%. A uniform independent one-time key is used. What happens after the attacker observes one ciphertext bit?",
    options: [
      "M = 0 becomes certain.",
      "The belief changes to 50/50.",
      "The belief remains 80/20.",
      "The attacker learns the key.",
    ],
    answer: 2,
    explanation:
      "With a uniform independent key, either ciphertext is equally likely for either message, so the observation does not change the 80/20 prior.",
    lesson: { label: "Perfect Secrecy", path: "/perfect-secrecy" },
  },
  {
    id: "otp-reuse",
    topic: "One-Time Pad",
    question:
      "Two messages are encrypted with the same one-time pad. What can an observer compute from C₁ and C₂?",
    options: [
      "The secret pad directly",
      "M₁ XOR M₂",
      "Both messages directly",
      "A fresh independent pad",
    ],
    answer: 1,
    explanation:
      "The reused pad cancels: C₁ XOR C₂ = M₁ XOR M₂. If one plaintext is known, the other can then be recovered.",
    lesson: { label: "One-Time Pad", path: "/one-time-pad" },
  },
  {
    id: "cpa-deterministic-oracle",
    topic: "CPA Security",
    question:
      "A challenge uses deterministic fixed-pad XOR, and an oracle encrypts any chosen message with that same pad. What is the winning attack?",
    options: [
      "Query both challenge candidates and compare their ciphertexts with the challenge.",
      "Guess without using the oracle.",
      "Hash the challenge ciphertext.",
      "Ask the oracle for a random unrelated message only.",
    ],
    answer: 0,
    explanation:
      "Deterministic encryption gives each candidate a repeatable ciphertext. Querying both candidates reveals which one exactly matches the challenge.",
    lesson: { label: "CPA Security", path: "/cpa-security" },
  },
  {
    id: "ctr-bit-flip",
    topic: "CTR Mode",
    question:
      "An attacker flips one bit of a CTR ciphertext that has no authentication. What happens when the receiver decrypts it?",
    options: [
      "The corresponding plaintext bit flips without automatic detection.",
      "Every plaintext bit becomes random.",
      "The ciphertext repairs itself.",
      "The receiver automatically recovers the original bit.",
    ],
    answer: 0,
    explanation:
      "CTR decryption XORs the ciphertext with a keystream, so changing one ciphertext bit changes the matching plaintext bit. Encryption alone does not detect it.",
    lesson: { label: "CTR and MACs", path: "/macs" },
  },
  {
    id: "hmac-tampering",
    topic: "MACs",
    question:
      "An attacker changes an authenticated ciphertext but leaves its original HMAC tag attached. What should the receiver do?",
    options: [
      "Decrypt first and ignore the tag.",
      "Generate a replacement tag for the attacker.",
      "Reject it because verification fails.",
      "Accept it if only one bit changed.",
    ],
    answer: 2,
    explanation:
      "The original tag authenticates the original bytes. Modified ciphertext fails verification and must be rejected before its plaintext is used.",
    lesson: { label: "Message Authentication Codes", path: "/macs" },
  },
  {
    id: "truncated-hash-collision",
    topic: "Hash Functions",
    question:
      "Two distinct inputs share the same first 8 bits of SHA-256. What has the exercise demonstrated?",
    options: [
      "A collision in the truncated 8-bit output, not necessarily full SHA-256",
      "A full SHA-256 collision",
      "Recovery of both original inputs from a digest",
      "A valid HMAC forgery",
    ],
    answer: 0,
    explanation:
      "Matching an 8-bit prefix is a collision only for that deliberately shortened output. The full 256-bit digests can still be different.",
    lesson: { label: "Hash Functions", path: "/hash-functions" },
  },
];

export const practiceTopics = [
  "Probability Basics",
  "Perfect Secrecy",
  "One-Time Pad",
  "Attack Simulator",
  "CPA Security",
  "CTR Mode",
  "MACs",
  "Hash Functions",
];
