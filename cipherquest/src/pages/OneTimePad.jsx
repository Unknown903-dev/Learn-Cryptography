import { useState } from "react";
import { Link } from "react-router-dom";
import { EIGHT_BITS, generateRandomBits, xorBits } from "../utils/otp";

function BinaryInput({ id, label, value, onChange }) {
  const isValid = EIGHT_BITS.test(value);

  return (
    <label htmlFor={id}>
      {label}
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputMode="numeric"
        autoComplete="off"
        spellCheck="false"
        aria-invalid={!isValid}
        aria-describedby={`${id}-hint`}
      />
      <small id={`${id}-hint`} className={isValid ? "input-hint" : "input-error"}>
        {isValid ? "Exactly 8 binary digits." : "Enter exactly eight 0 or 1 digits."}
      </small>
    </label>
  );
}

function BitRow({ label, operator = "", bits, tone = "" }) {
  return (
    <div className={`bit-row ${tone}`}>
      <span className="bit-label">{label}</span>
      <span className="bit-operator" aria-hidden="true">{operator}</span>
      <span className="bit-cells" aria-label={`${label}: ${bits}`}>
        {bits.split("").map((bit, index) => (
          <span className="bit-cell" key={`${label}-${index}`}>{bit}</span>
        ))}
      </span>
    </div>
  );
}

function XorStack({ firstLabel, first, secondLabel, second, resultLabel, result }) {
  return (
    <div className="xor-stack">
      <BitRow label={firstLabel} bits={first} />
      <BitRow label={secondLabel} operator="⊕" bits={second} />
      <div className="bit-divider" />
      <BitRow label={resultLabel} operator="=" bits={result} tone="result" />
    </div>
  );
}

function OneTimePad() {
  const [message, setMessage] = useState("10110010");
  const [pad, setPad] = useState(generateRandomBits);
  const [step, setStep] = useState(1);
  const [firstMessage, setFirstMessage] = useState("10110010");
  const [secondMessage, setSecondMessage] = useState("01101100");
  const [reuseMode, setReuseMode] = useState("fresh");
  const [sharedPad, setSharedPad] = useState(generateRandomBits);
  const [firstFreshPad, setFirstFreshPad] = useState(generateRandomBits);
  const [secondFreshPad, setSecondFreshPad] = useState(generateRandomBits);
  const [prediction, setPrediction] = useState(null);

  const messageIsValid = EIGHT_BITS.test(message);
  const ciphertext = messageIsValid ? xorBits(message, pad) : null;
  const recoveredMessage = ciphertext ? xorBits(ciphertext, pad) : null;

  const experimentIsValid =
    EIGHT_BITS.test(firstMessage) && EIGHT_BITS.test(secondMessage);
  const firstPad = reuseMode === "reuse" ? sharedPad : firstFreshPad;
  const secondPad = reuseMode === "reuse" ? sharedPad : secondFreshPad;
  const firstCiphertext = experimentIsValid
    ? xorBits(firstMessage, firstPad)
    : null;
  const secondCiphertext = experimentIsValid
    ? xorBits(secondMessage, secondPad)
    : null;
  const ciphertextXor = experimentIsValid
    ? xorBits(firstCiphertext, secondCiphertext)
    : null;
  const messageXor = experimentIsValid
    ? xorBits(firstMessage, secondMessage)
    : null;
  const recoveredSecondMessage = experimentIsValid
    ? xorBits(firstMessage, ciphertextXor)
    : null;

  const generateExperimentPads = () => {
    setSharedPad(generateRandomBits());
    setFirstFreshPad(generateRandomBits());
    setSecondFreshPad(generateRandomBits());
  };

  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Interactive Encryption Lesson</p>
        <h1>One-Time Pad</h1>
        <p>
          Encrypt and decrypt one byte with XOR, then discover why using a pad
          more than once destroys its secrecy.
        </p>
      </div>

      <div className="demo-panel">
        <div className="formula-box">C = M ⊕ K &nbsp;&nbsp; M = C ⊕ K</div>
        <p className="security-note">
          Educational demo only. This client-side, 8-bit model builds intuition
          and is not production encryption software.
        </p>

        <div className="explanation-box">
          <p className="eyebrow">Part 1</p>
          <h2>Encrypt, then decrypt</h2>
          <p>
            Edit the message or generate a new uniformly random pad. Each column
            is one XOR operation: equal bits produce 0 and different bits produce 1.
          </p>

          <div className="otp-input-grid">
            <BinaryInput
              id="otp-message"
              label="8-bit message M"
              value={message}
              onChange={(value) => {
                setMessage(value);
                setStep(1);
              }}
            />
            <div className="pad-control">
              <span>Secret pad K</span>
              <code>{pad}</code>
              <button
                className="btn secondary"
                type="button"
                onClick={() => {
                  setPad(generateRandomBits());
                  setStep(1);
                }}
              >
                Generate new pad
              </button>
            </div>
          </div>

          {!messageIsValid && (
            <p className="error-box" role="alert">
              The walkthrough needs a message containing exactly eight binary digits.
            </p>
          )}

          {messageIsValid && (
            <>
              <div className="step-tabs" aria-label="One-time pad walkthrough steps">
                <button
                  className={`mode-button ${step === 1 ? "active" : ""}`}
                  type="button"
                  aria-pressed={step === 1}
                  onClick={() => setStep(1)}
                >
                  1. Encrypt
                </button>
                <button
                  className={`mode-button ${step === 2 ? "active" : ""}`}
                  type="button"
                  aria-pressed={step === 2}
                  onClick={() => setStep(2)}
                >
                  2. Decrypt
                </button>
              </div>

              {step === 1 ? (
                <div className="walkthrough-step" aria-live="polite">
                  <h3>Encryption: C = M ⊕ K</h3>
                  <XorStack
                    firstLabel="M"
                    first={message}
                    secondLabel="K"
                    second={pad}
                    resultLabel="C"
                    result={ciphertext}
                  />
                  <button className="btn primary" type="button" onClick={() => setStep(2)}>
                    Continue to decryption
                  </button>
                </div>
              ) : (
                <div className="walkthrough-step" aria-live="polite">
                  <h3>Decryption: M = C ⊕ K</h3>
                  <XorStack
                    firstLabel="C"
                    first={ciphertext}
                    secondLabel="K"
                    second={pad}
                    resultLabel="M"
                    result={recoveredMessage}
                  />
                  <p className="success-callout">
                    Round trip complete: the recovered message matches the original.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="explanation-box">
          <p className="eyebrow">Part 2</p>
          <h2>What goes wrong when a pad is reused?</h2>
          <p>
            Encrypt two messages with fresh independent pads, then deliberately
            reuse one pad and compare what an observer can compute.
          </p>

          <div className="otp-input-grid">
            <BinaryInput
              id="first-message"
              label="First message M₁"
              value={firstMessage}
              onChange={setFirstMessage}
            />
            <BinaryInput
              id="second-message"
              label="Second message M₂"
              value={secondMessage}
              onChange={setSecondMessage}
            />
          </div>

          <fieldset className="key-model-picker">
            <legend>Pad strategy</legend>
            <label className={`key-model-option ${reuseMode === "fresh" ? "selected" : ""}`}>
              <input
                type="radio"
                name="pad-strategy"
                value="fresh"
                checked={reuseMode === "fresh"}
                onChange={(event) => setReuseMode(event.target.value)}
              />
              <span>
                <strong>Fresh independent pads</strong>
                <small>K₁ and K₂ are generated independently and each is used once.</small>
              </span>
            </label>
            <label className={`key-model-option ${reuseMode === "reuse" ? "selected" : ""}`}>
              <input
                type="radio"
                name="pad-strategy"
                value="reuse"
                checked={reuseMode === "reuse"}
                onChange={(event) => setReuseMode(event.target.value)}
              />
              <span>
                <strong>Insecure reused pad</strong>
                <small>The same K encrypts both messages, violating the “one-time” rule.</small>
              </span>
            </label>
          </fieldset>

          <button className="btn secondary" type="button" onClick={generateExperimentPads}>
            Generate new experiment pads
          </button>

          {!experimentIsValid && (
            <p className="error-box" role="alert">
              Both experiment messages must contain exactly eight binary digits.
            </p>
          )}

          {experimentIsValid && (
            <div className="reuse-results" aria-live="polite">
              <div className="cipher-comparison">
                <article className="probability-card">
                  <h3>First encryption</h3>
                  <BitRow label="M₁" bits={firstMessage} />
                  <BitRow label="K₁" bits={firstPad} />
                  <BitRow label="C₁" bits={firstCiphertext} tone="result" />
                </article>
                <article className="probability-card">
                  <h3>Second encryption</h3>
                  <BitRow label="M₂" bits={secondMessage} />
                  <BitRow label="K₂" bits={secondPad} />
                  <BitRow label="C₂" bits={secondCiphertext} tone="result" />
                </article>
              </div>

              <div className={reuseMode === "reuse" ? "warning-box" : "learning-callout"}>
                <h3>Observer computes C₁ ⊕ C₂</h3>
                <XorStack
                  firstLabel="C₁"
                  first={firstCiphertext}
                  secondLabel="C₂"
                  second={secondCiphertext}
                  resultLabel="Result"
                  result={ciphertextXor}
                />
                {reuseMode === "reuse" ? (
                  <>
                    <div className="formula-box">C₁ ⊕ C₂ = M₁ ⊕ M₂ = {messageXor}</div>
                    <p>
                      The reused pad cancels: (M₁ ⊕ K) ⊕ (M₂ ⊕ K) = M₁ ⊕ M₂.
                      If the observer knows M₁, they recover M₂:
                    </p>
                    <div className="formula-box">
                      M₂ = M₁ ⊕ C₁ ⊕ C₂ = {recoveredSecondMessage}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="formula-box">
                      C₁ ⊕ C₂ = M₁ ⊕ M₂ ⊕ K₁ ⊕ K₂
                    </div>
                    <p>
                      Independent pads do not systematically cancel. Their unknown
                      difference remains, so this value does not expose M₁ ⊕ M₂.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="explanation-box">
          <h2>The five one-time pad rules</h2>
          <p>A one-time pad must be:</p>
          <ul className="otp-rules">
            <li><strong>Secret</strong> — only sender and receiver know it.</li>
            <li><strong>Uniformly random</strong> — every pad is equally likely.</li>
            <li><strong>Independent</strong> — pad generation does not depend on the message.</li>
            <li><strong>As long as the message</strong> — every message bit gets a pad bit.</li>
            <li><strong>Used once</strong> — reuse creates the cancellation attack above.</li>
          </ul>
        </div>

        <div className="prediction-box">
          <h2>Prediction check</h2>
          <p>
            An attacker gets two ciphertexts encrypted with the same pad. What
            can they immediately compute without knowing the pad?
          </p>
          <div className="answer-list">
            <button className="answer-button" type="button" onClick={() => setPrediction("correct")}>
              The XOR of the two plaintexts
            </button>
            <button className="answer-button" type="button" onClick={() => setPrediction("incorrect")}>
              Both plaintexts directly
            </button>
          </div>
          {prediction && (
            <p className={`prediction-feedback ${prediction}`} role="status">
              {prediction === "correct"
                ? "Correct. C₁ ⊕ C₂ cancels the reused pad and reveals M₁ ⊕ M₂. A known plaintext then reveals the other message."
                : "Not quite. Reuse immediately reveals M₁ ⊕ M₂, not both messages by itself. If one plaintext becomes known, the other can then be recovered."}
            </p>
          )}
        </div>

        <div className="lesson-navigation">
          <Link className="btn secondary" to="/perfect-secrecy">← Previous: Perfect Secrecy</Link>
          <Link className="btn primary" to="/lessons">Back to all lessons</Link>
        </div>
      </div>
    </section>
  );
}

export default OneTimePad;
