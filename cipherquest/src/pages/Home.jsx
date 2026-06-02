import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="eyebrow">Interactive Cryptography Learning</p>

        <h1>Learn cryptography by breaking it, proving it, and visualizing it.</h1>

        <p className="hero-text">
          CipherQuest helps students understand cryptography through guided
          proofs, attack simulations, visual demos, and exam-style practice.
        </p>

        <div className="hero-buttons">
          <Link to="/lessons" className="btn primary">
            Start Learning
          </Link>

          <Link to="/attack-simulator" className="btn secondary">
            Try Attack Simulator
          </Link>
        </div>
      </div>

      <div className="feature-grid">
        <article className="feature-card">
          <h3>Guided Proofs</h3>
          <p>
            Walk through perfect secrecy, Bayes theorem, EAV security, and CPA
            security step by step.
          </p>
        </article>

        <article className="feature-card">
          <h3>Attack Simulations</h3>
          <p>
            Learn how broken encryption schemes fail by testing simple attacks
            yourself.
          </p>
        </article>

        <article className="feature-card">
          <h3>Visual Examples</h3>
          <p>
            See how XOR encryption, CBC mode, CTR mode, MACs, and hash functions
            work.
          </p>
        </article>
      </div>
    </section>
  );
}

export default Home;