import { useState } from "react";
import { Link } from "react-router-dom";

const XOR_OUTCOMES = [
  { message: 0, key: 0, ciphertext: 0 },
  { message: 0, key: 1, ciphertext: 1 },
  { message: 1, key: 0, ciphertext: 1 },
  { message: 1, key: 1, ciphertext: 0 },
];

const PRIOR_OPTIONS = {
  balanced: { 0: 0.5, 1: 0.5, label: "50% / 50%" },
  weighted: { 0: 0.8, 1: 0.2, label: "80% / 20%" },
};

const KEY_OPTIONS = {
  uniform: {
    label: "Uniform random key",
    description:
      "K is chosen independently of M, with P(K = 0) = P(K = 1) = 50%.",
    probability: { 0: 0.5, 1: 0.5 },
  },
  fixed: {
    label: "Insecure fixed key: K = 0",
    description:
      "K is always zero. XOR with zero leaves the message unchanged, so C = M.",
    probability: { 0: 1, 1: 0 },
  },
};

const formatPercent = (value) => `${Math.round(value * 100)}%`;

function PerfectSecrecy() {
  const [message, setMessage] = useState(0);
  const [keyValue, setKeyValue] = useState(0);
  const [priorChoice, setPriorChoice] = useState("balanced");
  const [observedCiphertext, setObservedCiphertext] = useState(0);
  const [keyChoice, setKeyChoice] = useState("uniform");
  const [prediction, setPrediction] = useState(null);

  const ciphertext = message ^ keyValue;
  const prior = PRIOR_OPTIONS[priorChoice];
  const keyModel = KEY_OPTIONS[keyChoice];

  const weightedOutcomes = XOR_OUTCOMES.map((outcome) => ({
    ...outcome,
    probability:
      prior[outcome.message] * keyModel.probability[outcome.key],
  }));

  const evidenceProbability = weightedOutcomes
    .filter((outcome) => outcome.ciphertext === observedCiphertext)
    .reduce((total, outcome) => total + outcome.probability, 0);

  const likelihoods = [0, 1].map((messageBit) =>
    XOR_OUTCOMES.filter(
      (outcome) =>
        outcome.message === messageBit &&
        outcome.ciphertext === observedCiphertext,
    ).reduce(
      (total, outcome) => total + keyModel.probability[outcome.key],
      0,
    ),
  );

  const posterior = {
    0: (likelihoods[0] * prior[0]) / evidenceProbability,
    1: (likelihoods[1] * prior[1]) / evidenceProbability,
  };

  return (
    <section>
      <div className="page-header">
        <p className="eyebrow">Interactive Proof</p>
        <h1>Perfect Secrecy Demo</h1>
        <p>
          This demo uses XOR encryption to show why the one-time pad can hide
          information about the message.
        </p>
      </div>

      <div className="demo-panel">
        <div className="formula-box">c = m XOR k</div>

        <p className="security-note">
          Educational demo only. This simplified XOR example is used to explain
          perfect secrecy and should not be used as real-world encryption code.
        </p>

        <div className="controls">
          <label>
            Message m
            <select
              value={message}
              onChange={(event) => setMessage(Number(event.target.value))}
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
            </select>
          </label>

          <label>
            Key k
            <select
              value={keyValue}
              onChange={(event) => setKeyValue(Number(event.target.value))}
            >
              <option value={0}>0</option>
              <option value={1}>1</option>
            </select>
          </label>
        </div>

        <div className="result-box">
          <p>m = <strong>{message}</strong></p>
          <p>k = <strong>{keyValue}</strong></p>
          <p>c = <strong>{ciphertext}</strong></p>
        </div>

        <div className="explanation-box">
          <h2>Why this matters</h2>
          <p>
            In perfect secrecy, seeing the ciphertext should not change what an
            attacker believes about the message.
          </p>
          <div className="formula-box">
            Pr[M = m | C = c] = Pr[M = m]
          </div>
          <p>
            With a uniformly random one-bit key, both messages can produce both
            ciphertexts. That means the ciphertext alone does not reveal which
            message was encrypted.
          </p>
        </div>

        <div className="explanation-box">
          <h2>Truth Table</h2>
          <p>
            This table shows every possible message and key combination for
            one-bit XOR encryption.
          </p>
          <div className="truth-table">
            <div className="truth-row truth-header">
              <span>m</span>
              <span>k</span>
              <span>c = m XOR k</span>
            </div>
            {XOR_OUTCOMES.map((outcome) => (
              <div className="truth-row" key={`${outcome.message}-${outcome.key}`}>
                <span>{outcome.message}</span>
                <span>{outcome.key}</span>
                <span>{outcome.ciphertext}</span>
              </div>
            ))}
          </div>
          <p>
            Notice that ciphertext 0 can come from message 0 or message 1.
            Ciphertext 1 can also come from message 0 or message 1. Because the
            key is random, the attacker cannot tell which message was used.
          </p>
        </div>

        <div className="explanation-box inference-lab">
          <p className="eyebrow">Guided Lab</p>
          <h2>What can an attacker infer?</h2>
          <p>
            Set the attacker&apos;s belief before encryption, choose how the key
            is generated, and reveal one ciphertext bit. Then compare the
            attacker&apos;s belief before and after the observation.
          </p>

          <div className="lab-controls">
            <label>
              Message prior
              <select
                value={priorChoice}
                onChange={(event) => setPriorChoice(event.target.value)}
              >
                <option value="balanced">50/50: M = 0 or M = 1</option>
                <option value="weighted">80/20: M = 0 is more likely</option>
              </select>
            </label>
            <label>
              Attacker observes
              <select
                value={observedCiphertext}
                onChange={(event) =>
                  setObservedCiphertext(Number(event.target.value))
                }
              >
                <option value={0}>Ciphertext C = 0</option>
                <option value={1}>Ciphertext C = 1</option>
              </select>
            </label>
          </div>

          <fieldset className="key-model-picker">
            <legend>Key-generation assumption</legend>
            {Object.entries(KEY_OPTIONS).map(([value, option]) => (
              <label
                className={`key-model-option ${keyChoice === value ? "selected" : ""}`}
                key={value}
              >
                <input
                  type="radio"
                  name="key-model"
                  value={value}
                  checked={keyChoice === value}
                  onChange={(event) => setKeyChoice(event.target.value)}
                />
                <span>
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </span>
              </label>
            ))}
          </fieldset>

          <div className="probability-comparison" aria-live="polite">
            <article className="probability-card">
              <span className="comparison-label">Before observation</span>
              <h3>Prior belief</h3>
              <p>P(M = 0) <strong>{formatPercent(prior[0])}</strong></p>
              <div
                className="probability-bar"
                role="img"
                aria-label={`Prior probability of M equals 0 is ${formatPercent(prior[0])}`}
              >
                <span style={{ width: formatPercent(prior[0]) }} />
              </div>
              <p>P(M = 1) <strong>{formatPercent(prior[1])}</strong></p>
            </article>

            <span className="comparison-arrow" aria-hidden="true">→</span>

            <article className="probability-card posterior-card">
              <span className="comparison-label">
                After observing C = {observedCiphertext}
              </span>
              <h3>Posterior belief</h3>
              <p>
                P(M = 0 | C = {observedCiphertext}){" "}
                <strong>{formatPercent(posterior[0])}</strong>
              </p>
              <div
                className="probability-bar"
                role="img"
                aria-label={`Posterior probability of M equals 0 is ${formatPercent(posterior[0])}`}
              >
                <span style={{ width: formatPercent(posterior[0]) }} />
              </div>
              <p>
                P(M = 1 | C = {observedCiphertext}){" "}
                <strong>{formatPercent(posterior[1])}</strong>
              </p>
            </article>
          </div>

          <div className="lab-conclusion" aria-live="polite">
            <strong>
              {keyChoice === "uniform"
                ? "The observation reveals nothing about M."
                : "The observation reveals M completely."}
            </strong>
            <p>
              {keyChoice === "uniform"
                ? `The posterior stays ${prior.label}, exactly matching the prior.`
                : `Because K = 0, C = M. Seeing C = ${observedCiphertext} rules out the other message.`}
            </p>
          </div>

          <details className="outcome-details">
            <summary>See how the four XOR outcomes are weighted</summary>
            <div className="outcome-table-wrap">
              <table className="outcome-table">
                <thead>
                  <tr>
                    <th scope="col">M</th>
                    <th scope="col">K</th>
                    <th scope="col">C</th>
                    <th scope="col">P(M, K)</th>
                    <th scope="col">Matches observation?</th>
                  </tr>
                </thead>
                <tbody>
                  {weightedOutcomes.map((outcome) => (
                    <tr key={`${outcome.message}-${outcome.key}`}>
                      <td>{outcome.message}</td>
                      <td>{outcome.key}</td>
                      <td>{outcome.ciphertext}</td>
                      <td>{formatPercent(outcome.probability)}</td>
                      <td>{outcome.ciphertext === observedCiphertext ? "Yes" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>

          <div className="bayes-work">
            <h3>Bayes calculation</h3>
            <p>
              The matching rows give P(C = {observedCiphertext}) ={" "}
              <strong>{formatPercent(evidenceProbability)}</strong>.
            </p>
            {[0, 1].map((messageBit) => (
              <div className="formula-box" key={messageBit}>
                P(M={messageBit} | C={observedCiphertext}) = P(C=
                {observedCiphertext} | M={messageBit}) × P(M={messageBit}) ÷
                P(C={observedCiphertext}) = {formatPercent(likelihoods[messageBit])}
                {" × "}{formatPercent(prior[messageBit])} ÷{" "}
                {formatPercent(evidenceProbability)} ={" "}
                {formatPercent(posterior[messageBit])}
              </div>
            ))}
            <p>
              Need a refresher on the update rule?{" "}
              <Link className="inline-link" to="/bayes-theorem">
                Review Bayes theorem
              </Link>.
            </p>
          </div>

          <div className="prediction-box">
            <h3>Predict before you test</h3>
            <p>
              With an 80/20 message prior and a uniform independent key, what
              happens after the attacker observes C = 1?
            </p>
            <div className="answer-list">
              <button
                className="answer-button"
                type="button"
                onClick={() => setPrediction("correct")}
              >
                The belief stays 80/20
              </button>
              <button
                className="answer-button"
                type="button"
                onClick={() => setPrediction("incorrect")}
              >
                M = 1 becomes 100% likely
              </button>
            </div>
            {prediction && (
              <p className={`prediction-feedback ${prediction}`} role="status">
                {prediction === "correct"
                  ? "Correct. A uniform independent key makes either ciphertext equally likely for either message, so the observation does not change the 80/20 prior."
                  : "Not quite. That would be true for the fixed zero key. With a uniform independent key, C = 1 is equally likely for either message, so the posterior remains 80/20."}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PerfectSecrecy;
