import { Link } from "react-router-dom";

const resourceGroups = [
  {
    title: "Probability and Bayes",
    description: "Build intuition for sample spaces, conditioning, priors, and updated beliefs.",
    lessons: [
      { label: "Probability Basics", path: "/probability-basics" },
      { label: "Bayes Theorem", path: "/bayes-theorem" },
    ],
    resources: [
      {
        title: "Basic and conditional probability",
        provider: "Seeing Theory · Brown University",
        type: "Interactive notes",
        url: "https://seeing-theory.brown.edu/compound-probability/index.html",
        description: "Visualize how conditioning shrinks a sample space and changes probabilities.",
      },
      {
        title: "Bayesian inference",
        provider: "Seeing Theory · Brown University",
        type: "Interactive lesson",
        url: "https://seeing-theory.brown.edu/bayesian-inference/index.html",
        description: "Experiment with priors, evidence, likelihoods, and posterior probabilities.",
      },
      {
        title: "Bayes theorem: the geometry of changing beliefs",
        provider: "3Blue1Brown",
        type: "Video",
        url: "https://www.youtube.com/watch?v=HZGCoVF3YvM",
        description: "A visual explanation of why Bayes' rule works and how evidence changes beliefs.",
      },
    ],
  },
  {
    title: "Perfect secrecy and the one-time pad",
    description: "Go deeper on XOR encryption, key requirements, and why reusing a pad leaks information.",
    lessons: [
      { label: "Perfect Secrecy", path: "/perfect-secrecy" },
      { label: "One-Time Pad", path: "/one-time-pad" },
      { label: "Attack Simulator", path: "/attack-simulator" },
    ],
    resources: [
      {
        title: "Stream ciphers and the one-time pad",
        provider: "Stanford University · Dan Boneh",
        type: "Free video course",
        url: "https://crypto.stanford.edu/~dabo/courses/OnlineCrypto/index.html",
        description: "Short lectures cover perfect secrecy, pad reuse, stream ciphers, and common attacks.",
      },
      {
        title: "CS 255 cryptography lecture notes",
        provider: "Stanford University",
        type: "Course notes · PDF",
        url: "https://crypto.stanford.edu/~dwu4/notes/CS255LectureNotes.pdf",
        description: "Formal definitions, worked proofs, and examples of perfect secrecy and the OTP.",
      },
      {
        title: "Crypto Challenge Set 1",
        provider: "Cryptopals",
        type: "Coding practice",
        url: "https://cryptopals.com/sets/1",
        description: "Practice fixed XOR, repeating-key XOR, and attacks that build on key reuse.",
      },
    ],
  },
  {
    title: "Security games and chosen-plaintext attacks",
    description: "Study attacker capabilities and the security definitions used for modern encryption.",
    lessons: [
      { label: "EAV Security", path: "/attack-simulator" },
      { label: "CPA Security", path: "/cpa-security" },
    ],
    resources: [
      {
        title: "A Graduate Course in Applied Cryptography",
        provider: "Dan Boneh and Victor Shoup",
        type: "Free textbook",
        url: "https://crypto.stanford.edu/~dabo/cryptobook/",
        description: "Chapters 2 and 5 develop encryption security and chosen-plaintext attacks in depth.",
      },
      {
        title: "Online Cryptography Course",
        provider: "Stanford University · Dan Boneh",
        type: "Videos and slides",
        url: "https://crypto.stanford.edu/~dabo/courses/OnlineCrypto/index.html",
        description: "Includes semantic security, attack models, and active attacks on encryption.",
      },
    ],
  },
  {
    title: "CBC, CTR, and ciphertext tampering",
    description: "Compare standard modes with hands-on exercises showing why confidentiality is not integrity.",
    lessons: [
      { label: "CBC and CTR Modes", path: "/modes" },
      { label: "MACs", path: "/macs" },
    ],
    resources: [
      {
        title: "Approved block cipher modes",
        provider: "NIST Computer Security Resource Center",
        type: "Standard and reference",
        url: "https://csrc.nist.gov/Projects/Block-Cipher-Techniques/BCM/Current-Modes",
        description: "The official overview of CBC, CTR, and the other modes specified in SP 800-38A.",
      },
      {
        title: "Crypto Challenge Set 2",
        provider: "Cryptopals",
        type: "Coding practice",
        url: "https://cryptopals.com/sets/2",
        description: "Implement CBC, use an encryption oracle, and explore CBC bit-flipping attacks.",
      },
    ],
  },
  {
    title: "Message authentication and hash functions",
    description: "Connect HMAC, integrity, SHA-256, collision resistance, and authenticated encryption.",
    lessons: [
      { label: "MACs", path: "/macs" },
      { label: "Hash Functions", path: "/hash-functions" },
    ],
    resources: [
      {
        title: "Message Authentication Codes",
        provider: "NIST Computer Security Resource Center",
        type: "Standards overview",
        url: "https://csrc.nist.gov/projects/message-authentication-codes",
        description: "An official guide to HMAC, CMAC, and the standards that define them.",
      },
      {
        title: "Hash Functions",
        provider: "NIST Computer Security Resource Center",
        type: "Standards overview",
        url: "https://csrc.nist.gov/Projects/Hash-Functions",
        description: "Learn where SHA-256 and SHA-3 are specified and how approved hashes are used.",
      },
      {
        title: "Crypto Challenge Set 4",
        provider: "Cryptopals",
        type: "Advanced practice",
        url: "https://cryptopals.com/sets/4",
        description: "Explore CTR tampering, keyed hashes, length extension, and HMAC verification attacks.",
      },
    ],
  },
  {
    title: "More practice",
    description: "Test your understanding or continue into a broader cryptography curriculum.",
    lessons: [{ label: "Practice Mode", path: "/practice" }],
    resources: [
      {
        title: "Cryptography Challenge 101",
        provider: "Khan Academy",
        type: "Lessons and quizzes",
        url: "https://www.khanacademy.org/science/brit-cruise/cryptography",
        description: "Beginner-friendly cryptography lessons with checkpoints and coding challenges.",
      },
      {
        title: "The Cryptopals Crypto Challenges",
        provider: "Cryptopals",
        type: "Challenge collection",
        url: "https://cryptopals.com/",
        description: "A progressive set of programming exercises centered on real cryptographic attacks.",
      },
    ],
  },
];

function Resources() {
  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Resources</p>
        <h1>Keep learning</h1>
        <p>
          Free videos, notes, standards, visualizations, and practice selected to
          complement the lessons on Learn Crypto.
        </p>
      </div>

      <aside className="resource-note" aria-label="External resource note">
        <strong>About these links:</strong> Learn Crypto links to material hosted by
        its original publishers; it does not copy or redistribute their work. External
        sites control their own content, availability, and terms.
      </aside>

      <div className="resource-groups">
        {resourceGroups.map((group) => (
          <section className="resource-group" key={group.title}>
            <div className="resource-group-heading">
              <div>
                <h2>{group.title}</h2>
                <p>{group.description}</p>
              </div>
              <div className="resource-lesson-links" aria-label="Related Learn Crypto lessons">
                {group.lessons.map((lesson) => (
                  <Link to={lesson.path} key={lesson.label}>
                    {lesson.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="resource-grid">
              {group.resources.map((resource) => (
                <a
                  className="resource-card"
                  href={resource.url}
                  target="_blank"
                  rel="noreferrer"
                  key={resource.title}
                >
                  <span className="resource-type">{resource.type}</span>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <span className="resource-provider">
                    {resource.provider} <span aria-hidden="true">↗</span>
                  </span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

export default Resources;
