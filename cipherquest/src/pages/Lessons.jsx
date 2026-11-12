import { Link } from "react-router-dom";

const lessons = [
  {
    title: "Probability Basics",
    difficulty: "Beginner",
    type: "Foundation",
    description: "Explore sample spaces, events, and conditional probability with dice.",
    path: "/probability-basics",
    status: "Lab Available",
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
      "Run a guided lab to see what ciphertext reveals under secure and insecure keys.",
    path: "/perfect-secrecy",
    status: "Lab Available",
  },
  {
    title: "One-Time Pad",
    difficulty: "Intermediate",
    type: "Encryption",
    description: "Encrypt with an 8-bit pad and investigate why pads must never be reused.",
    path: "/one-time-pad",
    status: "Lab Available",
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
    description: "Use an encryption oracle to break a deterministic reused-pad scheme.",
    path: "/cpa-security",
    status: "Lab Available",
  },
  {
    title: "CBC Mode",
    difficulty: "Intermediate",
    type: "Visual",
    description: "Visualize cipher block chaining and the role of IVs.",
    path: "/modes",
    status: "Available",
  },
  {
    title: "CTR Mode",
    difficulty: "Intermediate",
    type: "Visual",
    description: "Learn how counters generate encryption pads.",
    path: "/modes",
    status: "Available",
  },
  {
    title: "MACs",
    difficulty: "Advanced",
    type: "Authentication",
    description: "Tamper with CTR-style ciphertext and detect it using HMAC.",
    path: "/macs",
    status: "Lab Available",
  },
  {
    title: "Hash Functions",
    difficulty: "Intermediate",
    type: "Integrity",
    description: "Compare SHA-256 digests and explore collisions and integrity.",
    path: "/hash-functions",
    status: "Lab Available",
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
