import { useMemo, useState } from "react";
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
        title: "Basic probability",
        provider: "Seeing Theory · Brown University",
        type: "Interactive notes",
        url: "https://seeing-theory.brown.edu/basic-probability/index.html",
        description: "Explore sample spaces, events, and probability through interactive visualizations.",
      },
      {
        title: "Compound and conditional probability",
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
      {
        title: "The quick proof of Bayes' theorem",
        provider: "3Blue1Brown",
        type: "Video",
        url: "https://www.youtube.com/watch?v=U_85TaXbeIo",
        description: "A concise geometric derivation of Bayes' rule for a quick review.",
      },
      {
        title: "Probability unit and quizzes",
        provider: "Khan Academy",
        type: "Lessons and quizzes",
        url: "https://www.khanacademy.org/math/statistics-probability/probability-library",
        description: "Practice sample spaces, independence, conditional probability, and compound events.",
      },
      {
        title: "Introduction to Probability",
        provider: "MIT OpenCourseWare",
        type: "Free video course",
        url: "https://ocw.mit.edu/courses/res-6-012-introduction-to-probability-spring-2018/resources/lecture-videos/",
        description: "A full course with short videos on conditioning, total probability, and Bayes' rule.",
      },
      {
        title: "Conditioning and Bayes' rule",
        provider: "MIT OpenCourseWare",
        type: "Lecture notes · PDF",
        url: "https://ocw.mit.edu/courses/res-6-012-introduction-to-probability-spring-2018/d7abbd52c69fab0187039ccac8fcddc7_MITRES_6_012S18_L02.pdf",
        description: "Lecture notes with definitions, derivations, and worked conditional-probability examples.",
      },
    ],
  },
  {
    title: "Perfect secrecy, XOR, and one-time pads",
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
        title: "Symmetric encryption lab",
        provider: "Stanford Pre-Collegiate Studies",
        type: "Notes and exercises",
        url: "https://crypto.stanford.edu/spcs/day2/",
        description: "Implement XOR, a one-time pad, stream encryption, and a many-time-pad attack.",
      },
      {
        title: "Crypto Challenge Set 1",
        provider: "Cryptopals",
        type: "Coding practice",
        url: "https://cryptopals.com/sets/1",
        description: "Practice fixed XOR, repeating-key XOR, and attacks that build on key reuse.",
      },
      {
        title: "Introduction to CryptoHack",
        provider: "CryptoHack",
        type: "Interactive course",
        url: "https://cryptohack.org/courses/intro/course_details/",
        description: "A beginner course covering encodings, bytes, XOR properties, and XOR puzzles.",
      },
      {
        title: "XOR challenges",
        provider: "CryptoHack",
        type: "Interactive practice",
        url: "https://cryptohack.org/challenges/general/",
        description: "Build fluency with byte encodings and XOR before attacking larger cryptosystems.",
      },
      {
        title: "Ciphers and the one-time pad",
        provider: "Khan Academy",
        type: "Lessons and quizzes",
        url: "https://www.khanacademy.org/science/brit-cruise/cryptography",
        description: "Beginner lessons on ciphers, XOR, perfect secrecy, and pseudorandom generators.",
      },
      {
        title: "The Joy of Cryptography",
        provider: "Mike Rosulek · Oregon State University",
        type: "Open-access textbook",
        url: "https://joyofcryptography.com/",
        description: "An undergraduate text covering OTPs, provable security, encryption, and authentication.",
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
        title: "CS 255 course syllabus and readings",
        provider: "Stanford University",
        type: "Course materials",
        url: "https://crypto.stanford.edu/~dabo/courses/cs255_winter16/syllabus.html",
        description: "Lecture slides and reading paths for semantic security, stream ciphers, and attacks.",
      },
      {
        title: "CS 255 practice final",
        provider: "Stanford University",
        type: "Practice exam · PDF",
        url: "https://crypto.stanford.edu/~dabo/courses/cs255_finals/final-23.pdf",
        description: "Test formal reasoning about perfect secrecy, modes, MACs, and encryption security.",
      },
      {
        title: "Invitation to Modern Cryptography",
        provider: "UC San Diego",
        type: "Course outline and videos",
        url: "https://cseweb.ucsd.edu/~mihir/cse207/outline.pdf",
        description: "A graduate course outline linking lectures on modern definitions and reductions.",
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
        title: "Report on block cipher modes",
        provider: "NIST Computer Security Resource Center",
        type: "Technical report",
        url: "https://csrc.nist.gov/pubs/ir/8459/final",
        description: "A modern survey of the security and implementation properties of NIST modes.",
      },
      {
        title: "Web Crypto encryption examples",
        provider: "MDN Web Docs",
        type: "Developer reference",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt",
        description: "Examples and safety notes for AES-CTR, AES-CBC, and authenticated AES-GCM.",
      },
      {
        title: "Symmetric Cryptography course",
        provider: "CryptoHack",
        type: "Interactive course",
        url: "https://cryptohack.org/courses/symmetric/course_details/",
        description: "Learn AES internals, modes, stream ciphers, oracles, and common implementation failures.",
      },
      {
        title: "Symmetric cipher challenges",
        provider: "CryptoHack",
        type: "Interactive practice",
        url: "https://www.cryptohack.org/challenges/aes/",
        description: "Attack CBC, CTR-like stream modes, encryption oracles, and bit-flipping mistakes.",
      },
      {
        title: "Crypto Challenge Set 2",
        provider: "Cryptopals",
        type: "Coding practice",
        url: "https://cryptopals.com/sets/2",
        description: "Implement CBC, use an encryption oracle, and explore CBC bit-flipping attacks.",
      },
      {
        title: "Implement CBC mode",
        provider: "Cryptopals",
        type: "Focused exercise",
        url: "https://cryptopals.com/sets/2/challenges/10",
        description: "Build CBC from a block cipher and XOR, then verify encryption and decryption.",
      },
      {
        title: "CBC bit-flipping attack",
        provider: "Cryptopals",
        type: "Focused exercise",
        url: "https://cryptopals.com/sets/2/challenges/16",
        description: "Modify a ciphertext to produce a controlled plaintext change without the key.",
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
        title: "HMAC specification",
        provider: "IETF Datatracker · RFC 2104",
        type: "Open standard",
        url: "https://datatracker.ietf.org/doc/rfc2104/",
        description: "The original public specification for keyed hashing used in message authentication.",
      },
      {
        title: "The Keyed-Hash Message Authentication Code",
        provider: "NIST · FIPS 198-1",
        type: "Federal standard",
        url: "https://csrc.nist.gov/pubs/fips/198-1/final",
        description: "NIST's HMAC definition, terminology, parameters, and security considerations.",
      },
      {
        title: "Web Crypto SubtleCrypto reference",
        provider: "MDN Web Docs",
        type: "Developer reference",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto",
        description: "Browser documentation for SHA digests, HMAC signing, verification, and AES.",
      },
      {
        title: "Interactive SHA-256 hash demo",
        provider: "MIT Blockchain",
        type: "Interactive demo",
        url: "https://blockchain.mit.edu/hash/",
        description: "Change an input and watch its SHA-256 digest and avalanche behavior update.",
      },
      {
        title: "Hash function challenges",
        provider: "CryptoHack",
        type: "Interactive practice",
        url: "https://www.cryptohack.org/challenges/hashes/",
        description: "Practice collision, preimage, birthday-bound, and length-extension concepts.",
      },
      {
        title: "Crypto Challenge Set 4",
        provider: "Cryptopals",
        type: "Advanced practice",
        url: "https://cryptopals.com/sets/4",
        description: "Explore CTR tampering, keyed hashes, length extension, and HMAC verification attacks.",
      },
      {
        title: "Cryptographic example values",
        provider: "NIST Computer Security Resource Center",
        type: "Test vectors",
        url: "https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines/example-values",
        description: "Official intermediate values for checking AES modes, SHA families, and MAC code.",
      },
      {
        title: "Hashing with CBC-MAC",
        provider: "Cryptopals",
        type: "Advanced exercise",
        url: "https://cryptopals.com/sets/7/challenges/50",
        description: "See why a keyed MAC and a public collision-resistant hash serve different goals.",
      },
    ],
  },
  {
    title: "Courses, books, tools, and challenge platforms",
    description: "Continue with a full curriculum or learn by solving safe, purpose-built exercises.",
    lessons: [{ label: "Practice Mode", path: "/practice" }],
    resources: [
      {
        title: "The Cryptopals Crypto Challenges",
        provider: "Cryptopals",
        type: "Challenge collection",
        url: "https://cryptopals.com/",
        description: "Progressive programming exercises centered on real cryptographic constructions and attacks.",
      },
      {
        title: "CryptoHack",
        provider: "CryptoHack",
        type: "Challenge platform",
        url: "https://cryptohack.org/",
        description: "A free platform for learning modern cryptography through guided puzzles and challenges.",
      },
      {
        title: "picoGym practice",
        provider: "picoCTF · Carnegie Mellon University",
        type: "CTF practice",
        url: "https://play.picoctf.org/practice",
        description: "A legal practice environment with beginner-friendly cryptography and security challenges.",
      },
      {
        title: "Krypton wargame",
        provider: "OverTheWire",
        type: "Command-line practice",
        url: "https://overthewire.org/wargames/krypton/",
        description: "A level-based cryptography wargame covering classical ciphers and basic cryptanalysis.",
      },
      {
        title: "CrypTool",
        provider: "CrypTool Project",
        type: "Learning tools",
        url: "https://www.cryptool.org/en/index.html",
        description: "Free, open-source tools for visualizing cryptography and cryptanalysis workflows.",
      },
      {
        title: "CrypTool-Online",
        provider: "CrypTool Project",
        type: "Browser lab",
        url: "https://www.cryptool.org/en/cto/",
        description: "Experiment with ciphers, encodings, AES, cryptanalysis, and educational games online.",
      },
      {
        title: "Applied Cryptography",
        provider: "National Tsing Hua University OpenCourseWare",
        type: "Open course",
        url: "https://ocw.nthu.edu.tw/courses/327?lang=en",
        description: "Lectures on probability, symmetric encryption, hashes, MACs, and public-key systems.",
      },
      {
        title: "MIT lecture on cryptography",
        provider: "MIT OpenCourseWare",
        type: "Lecture video",
        url: "https://learn.mit.edu/?resource=16913",
        description: "A free lecture connecting number theory, algorithms, and cryptographic security.",
      },
      {
        title: "Handbook of Applied Cryptography",
        provider: "University of Waterloo",
        type: "Free reference chapters",
        url: "https://cacr.uwaterloo.ca/hac/",
        description: "Author-hosted reference chapters on hashes, data integrity, encryption, and protocols.",
      },
    ],
  },
];

const totalResourceCount = resourceGroups.reduce(
  (total, group) => total + group.resources.length,
  0,
);

function Resources() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");

  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return resourceGroups
      .filter((group) => topic === "all" || group.title === topic)
      .map((group) => ({
        ...group,
        resources: group.resources.filter((resource) => {
          if (!normalizedQuery) return true;

          return [
            resource.title,
            resource.provider,
            resource.type,
            resource.description,
            group.title,
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);
        }),
      }))
      .filter((group) => group.resources.length > 0);
  }, [query, topic]);

  const visibleResourceCount = filteredGroups.reduce(
    (total, group) => total + group.resources.length,
    0,
  );

  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Resources</p>
        <h1>Keep learning</h1>
        <p>
          Search {totalResourceCount} free videos, notes, standards,
          visualizations, courses, and practice resources selected to
          complement Learn Crypto.
        </p>
      </div>

      <aside className="resource-note" aria-label="External resource note">
        <strong>About these links:</strong> Learn Crypto links directly to material
        hosted by its original publisher. It does not copy, rehost, frame, or claim
        ownership of third-party work. External sites control their own content,
        availability, accounts, licenses, and terms.
      </aside>

      <div className="resource-toolbar" role="search">
        <label>
          Search resources
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try Bayes, XOR, HMAC, video…"
          />
        </label>

        <label>
          Filter by topic
          <select value={topic} onChange={(event) => setTopic(event.target.value)}>
            <option value="all">All topics</option>
            {resourceGroups.map((group) => (
              <option value={group.title} key={group.title}>
                {group.title}
              </option>
            ))}
          </select>
        </label>

        <p className="resource-count" aria-live="polite">
          Showing <strong>{visibleResourceCount}</strong> of {totalResourceCount}
        </p>
      </div>

      {filteredGroups.length > 0 ? (
        <div className="resource-groups">
          {filteredGroups.map((group) => (
            <section className="resource-group" key={group.title}>
              <div className="resource-group-heading">
                <div>
                  <h2>{group.title}</h2>
                  <p>{group.description}</p>
                </div>
                <div className="resource-lesson-links" aria-label={`Learn Crypto lessons related to ${group.title}`}>
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
                    rel="noopener noreferrer"
                    key={resource.url}
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
      ) : (
        <div className="resource-empty" role="status">
          <h2>No resources found</h2>
          <p>Try a broader search or choose a different topic.</p>
          <button
            className="btn secondary"
            type="button"
            onClick={() => {
              setQuery("");
              setTopic("all");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}

export default Resources;
