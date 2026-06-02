import { Link } from "react-router-dom";

const lessons = [
  {
    title: "Probability Basics",
    difficulty: "Beginner",
    type: "Foundation",
    description: "Review probability rules used in cryptographic proofs.",
    path: null,
    status: "Coming Soon",
  },
  {
    title: "Bayes Theorem",
    difficulty: "Beginner",
    type: "Proof",
    description:
      "Understand conditional probability and how it connects to secrecy.",
    path: "/bayes-theorem",
    status: "Available",
  },
  {
    title: "Perfect Secrecy",
    difficulty: "Intermediate",
    type: "Proof",
    description:
      "Learn what it means for ciphertext to reveal no information.",
    path: "/perfect-secrecy",
    status: "Available",
  },
  {
    title: "One-Time Pad",
    difficulty: "Intermediate",
    type: "Encryption",
    description: "Explore why the one-time pad can achieve perfect secrecy.",
    path: null,
    status: "Coming Soon",
  },
  {
    title: "EAV Security",
    difficulty: "Intermediate",
    type: "Security Game",
    description: "Learn how attackers distinguish encrypted messages.",
    path: "/attack-simulator",
    status: "Demo Available",
  },
  {
    title: "CPA Security",
    difficulty: "Advanced",
    type: "Security Game",
    description: "Understand chosen-plaintext attacks and stronger security.",
    path: null,
    status: "Coming Soon",
  },
  {
    title: "CBC Mode",
    difficulty: "Intermediate",
    type: "Visual",
    description: "Visualize cipher block chaining and the role of IVs.",
    path: null,
    status: "Coming Soon",
  },
  {
    title: "CTR Mode",
    difficulty: "Intermediate",
    type: "Visual",
    description: "Learn how counters generate encryption pads.",
    path: null,
    status: "Coming Soon",
  },
  {
    title: "MACs",
    difficulty: "Advanced",
    type: "Authentication",
    description: "Study message authentication and forgery resistance.",
    path: null,
    status: "Coming Soon",
  },
  {
    title: "Hash Functions",
    difficulty: "Intermediate",
    type: "Integrity",
    description: "Understand collisions, preimage resistance, and hashing.",
    path: null,
    status: "Coming Soon",
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
        {lessons.map((lesson) => {
          const cardContent = (
            <>
              <div className="lesson-card-top">
                <span className="badge">{lesson.type}</span>
                <span
                  className={
                    lesson.path ? "status-pill available" : "status-pill"
                  }
                >
                  {lesson.status}
                </span>
              </div>

              <h2>{lesson.title}</h2>
              <p>{lesson.description}</p>
              <small>Difficulty: {lesson.difficulty}</small>
            </>
          );

          if (lesson.path) {
            return (
              <Link
                to={lesson.path}
                className="lesson-card lesson-card-link"
                key={lesson.title}
              >
                {cardContent}
              </Link>
            );
          }

          return (
            <article className="lesson-card locked-card" key={lesson.title}>
              {cardContent}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Lessons;