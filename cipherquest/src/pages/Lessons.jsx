const lessons = [
  {
    title: "Probability Basics",
    difficulty: "Beginner",
    type: "Foundation",
    description: "Review probability rules used in cryptographic proofs.",
  },
  {
    title: "Bayes Theorem",
    difficulty: "Beginner",
    type: "Proof",
    description: "Understand conditional probability and how it connects to secrecy.",
  },
  {
    title: "Perfect Secrecy",
    difficulty: "Intermediate",
    type: "Proof",
    description: "Learn what it means for ciphertext to reveal no information.",
  },
  {
    title: "One-Time Pad",
    difficulty: "Intermediate",
    type: "Encryption",
    description: "Explore why the one-time pad can achieve perfect secrecy.",
  },
  {
    title: "EAV Security",
    difficulty: "Intermediate",
    type: "Security Game",
    description: "Learn how attackers distinguish encrypted messages.",
  },
  {
    title: "CPA Security",
    difficulty: "Advanced",
    type: "Security Game",
    description: "Understand chosen-plaintext attacks and stronger security.",
  },
  {
    title: "CBC Mode",
    difficulty: "Intermediate",
    type: "Visual",
    description: "Visualize cipher block chaining and the role of IVs.",
  },
  {
    title: "CTR Mode",
    difficulty: "Intermediate",
    type: "Visual",
    description: "Learn how counters generate encryption pads.",
  },
  {
    title: "MACs",
    difficulty: "Advanced",
    type: "Authentication",
    description: "Study message authentication and forgery resistance.",
  },
  {
    title: "Hash Functions",
    difficulty: "Intermediate",
    type: "Integrity",
    description: "Understand collisions, preimage resistance, and hashing.",
  },
];

function Lessons() {
  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Lessons</p>
        <h1>Cryptography Topics</h1>
        <p>
          Start with the basics, then move into formal security definitions,
          attacks, and encryption modes.
        </p>
      </div>

      <div className="lesson-grid">
        {lessons.map((lesson) => (
          <article className="lesson-card" key={lesson.title}>
            <span className="badge">{lesson.type}</span>
            <h2>{lesson.title}</h2>
            <p>{lesson.description}</p>
            <small>Difficulty: {lesson.difficulty}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Lessons;