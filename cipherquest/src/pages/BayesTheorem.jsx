function BayesTheorem() {
  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Probability Foundation</p>
        <h1>Bayes Theorem</h1>
        <p>
          Bayes theorem helps us reason about what an attacker learns after
          seeing a ciphertext. It is one of the most important probability tools
          used when proving perfect secrecy.
        </p>
      </div>

      <div className="demo-panel">
        <div className="formula-box">
          Pr[M = m | C = c] = Pr[C = c | M = m]Pr[M = m] / Pr[C = c]
        </div>

        <p className="security-note">
          Educational note: this page uses simplified probability examples to
          build intuition for cryptographic proofs.
        </p>

        <div className="explanation-box">
          <h2>What Bayes theorem tells us</h2>

          <p>
            Bayes theorem lets us update the probability of a message after
            seeing a ciphertext. In cryptography, this matters because secrecy
            depends on whether the ciphertext changes what the attacker believes.
          </p>

          <p>
            If the attacker sees a ciphertext c, we ask:
          </p>

          <div className="formula-box">
            Pr[M = m | C = c]
          </div>

          <p>
            This means: what is the probability that the original message was m,
            given that the attacker saw ciphertext c?
          </p>
        </div>

        <div className="explanation-box">
          <h2>How it connects to perfect secrecy</h2>

          <p>
            Perfect secrecy says that seeing the ciphertext should not change the
            attacker&apos;s belief about the message.
          </p>

          <div className="formula-box">
            Pr[M = m | C = c] = Pr[M = m]
          </div>

          <p>
            The left side is the attacker&apos;s belief after seeing the
            ciphertext. The right side is the attacker&apos;s belief before seeing
            the ciphertext.
          </p>

          <p>
            If both sides are equal, then the ciphertext did not reveal useful
            information about the message.
          </p>
        </div>

        <div className="explanation-box">
          <h2>Simple example</h2>

          <p>Suppose there are two possible messages:</p>

          <div className="formula-box">
            M = 0 or M = 1
          </div>

          <p>
            Before seeing the ciphertext, the attacker believes both messages are
            equally likely.
          </p>

          <div className="formula-box">
            Pr[M = 0] = 1/2 and Pr[M = 1] = 1/2
          </div>

          <p>
            If the attacker sees a ciphertext and still believes both messages
            are equally likely, then the ciphertext did not reveal information.
          </p>

          <div className="formula-box">
            Pr[M = 0 | C = c] = 1/2
          </div>

          <div className="formula-box">
            Pr[M = 1 | C = c] = 1/2
          </div>

          <p>
            That is exactly the idea behind perfect secrecy.
          </p>
        </div>

        <div className="explanation-box">
          <h2>Exam-style takeaway</h2>

          <p>
            When proving perfect secrecy, you are usually trying to show that
            the ciphertext does not change the probability of the message.
          </p>

          <div className="formula-box">
            Pr[M = m | C = c] = Pr[M = m]
          </div>

          <p>
            Or equivalently, you can show that every message can produce every
            ciphertext with the same probability.
          </p>

          <div className="formula-box">
            Pr[C = c | M = m] is the same for every message m
          </div>
        </div>
      </div>
    </section>
  );
}

export default BayesTheorem;